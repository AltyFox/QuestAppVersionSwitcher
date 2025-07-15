using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using ComputerUtils.Android.Logging;
using Android.Provider;
using Application = Android.App.Application;

namespace DanTheMan827.OnDeviceADB
{
    public static class AdbWrapper
    {
        public static string? AdbPath => AdbServer.AdbPath;
        public static bool IsServerRunning => AdbServer.Instance.IsRunning;

        public static AdbWifiState AdbWifiState
        {
            get => Settings.Global.GetInt(Application.Context.ContentResolver, "adb_wifi_enabled") == 1 ? AdbWifiState.Enabled : AdbWifiState.Disabled;
            set => Settings.Global.PutInt(Application.Context.ContentResolver, "adb_wifi_enabled", (int)value);
        }

        public static async Task StartServerAsync()
        {
            await AdbServer.Instance.StartAsync();
            await Task.Delay(100);
        }

        public static async Task StopServerAsync() => AdbServer.Instance.Stop();

        public static async Task KillServerAsync()
        {
            await RunAdbCommandAsync("kill-server");
            await StopServerAsync();
        }

        public static async Task<List<AdbDevice>> GetDevicesAsync()
        {
            await StartServerAsync();
            var info = await RunAdbCommandAsync("devices -l");
            var devices = new List<AdbDevice>();
            var lines = info.Output.Split('\n');
            foreach (var l in lines)
            {
                if (l.StartsWith("List of")) continue;
                var options = l.Split(' ');
                if (string.IsNullOrWhiteSpace(options[0])) continue;
                var device = new AdbDevice();
                device.id = options[0];
                foreach (var o in options)
                {
                    var p = o.Split(':');
                    if (p[0] == "model" && p.Length > 1)
                    {
                        device.name = p[1];
                        break;
                    }
                }
                devices.Add(device);
            }
            return devices;
        }

        public static async Task<ExitInfo> RunAdbCommandAsync(string arguments, AdbDevice? device = null)
        {
            await StartServerAsync();
            if (device != null)
            {
                arguments = $"-s \"{device.id}\" {arguments}";
            }

            var procStartInfo = new ProcessStartInfo(AdbPath)
            {
                RedirectStandardError = true,
                RedirectStandardOutput = true,
                UseShellExecute = false,
                Arguments = arguments
            };
            Logger.Log("Running adb " + arguments, "AdbWrapper");
            var proc = Process.Start(procStartInfo);

            if (proc == null)
            {
                throw new NullReferenceException(nameof(proc));
            }

            await proc.WaitForExitAsync();
            string error = await proc.StandardError.ReadToEndAsync();
            string output = await proc.StandardOutput.ReadToEndAsync();

            var i = new ExitInfo()
            {
                ExitCode = proc.ExitCode,
                Error = error,
                Output = output
            };
            Logger.Log("Exit code: " + i.ExitCode + "\n Error: " + i.Error + "\n\n Output: " + i.Output, "AdbWrapper");

            return i;
        }

        public static async Task<int> GetAdbWiFiPortAsync()
        {
            var logProc = Process.Start(new ProcessStartInfo()
            {
                FileName = "logcat",
                Arguments = "-d -s adbd -e adbwifi*",
                UseShellExecute = false,
                RedirectStandardOutput = true
            });

            if (logProc == null)
            {
                throw new NullReferenceException(nameof(logProc));
            }

            await logProc.WaitForExitAsync();

            var output = await logProc.StandardOutput.ReadToEndAsync();
            var matches = Regex.Matches(output, "adbwifi started on port (\\d+)");

            if (matches.Count > 0)
            {
                return int.Parse(matches.Last().Groups[1].Value);
            }

            return 0;
        }

        public static async Task<int> EnableAdbWiFiAsync(bool cycle = false)
        {
            if (cycle && AdbWifiState == AdbWifiState.Enabled)
            {
                AdbWifiState = AdbWifiState.Disabled;
                await Task.Delay(100);
            }

            AdbWifiState = AdbWifiState.Enabled;
            await Task.Delay(100);

            return await GetAdbWiFiPortAsync();
        }

        public static async Task DisableAdbWiFiAsync()
        {
            AdbWifiState = AdbWifiState.Disabled;
            await Task.Delay(100);
        }

        public static async Task<AdbDevice> ConnectAsync(string host, int port = 5555)
        {
            await StartServerAsync();

            var output = await RunAdbCommandAsync($"connect {host}:{port}");
            var match = Regex.Match(output.Output, "^connected to (.*)$", RegexOptions.Multiline);

            if (output.ExitCode != 0 || !match.Success)
            {
                throw new AdbException(output.Output);
            }

            return new AdbDevice { id = match.Groups[1].Value.Trim() };
        }

        public static async Task<bool> DisconnectAsync(AdbDevice? device = null)
        {
            await StartServerAsync();

            if (device == null)
            {
                return (await RunAdbCommandAsync("disconnect")).Output.Contains("disconnected everything");
            }
            else
            {
                return (await RunAdbCommandAsync($"disconnect {device.id}")).Output.Contains("disconnected ");
            }
        }

        public static async Task GrantPermissionsAsync(AdbDevice device)
        {
            await StartServerAsync();

            await RunAdbCommandAsync($"shell pm grant {Application.Context.PackageName} android.permission.WRITE_SECURE_SETTINGS", device);
            await RunAdbCommandAsync($"shell pm grant {Application.Context.PackageName} android.permission.READ_LOGS", device);
        }

        public static async Task GrantPermissionsAsync()
        {
            await StartServerAsync();

            var devices = await GetDevicesAsync();

            foreach (var device in devices)
            {
                await GrantPermissionsAsync(device);
            }
        }

        public static async Task TcpIpModeAsync(AdbDevice? device = null, int port = 5555)
        {
            await StartServerAsync();

            if (device == null)
            {
                await RunAdbCommandAsync($"tcpip {port}");
            }
            else
            {
                await RunAdbCommandAsync($"tcpip {port}", device);
                await DisconnectAsync(device);
            }

            await Task.Delay(100);
        }

        public static async Task TcpIpModeAsync(int port = 5555) => await TcpIpModeAsync(null, port);

        public class AdbDevice
        {
            public string id { get; set; } = "";
            public string name { get; set; } = "";

            public AdbDevice(string id, string name)
            {
                this.id = id;
                this.name = name;
            }

            public AdbDevice() { }

            public override string ToString()
            {
                return id + ": " + name;
            }
        }
    }
}
