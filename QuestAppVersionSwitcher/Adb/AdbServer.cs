using System;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using ComputerUtils.Android;
using ComputerUtils.Android.Logging;

namespace DanTheMan827.OnDeviceADB
{
    /// <summary>
    /// A class for managing the adb server.
    /// </summary>
    public class AdbServer : IDisposable
    {
        private static string? FilesDir => AndroidCore.context?.FilesDir?.Path;
        private static string? CacheDir => AndroidCore.context?.CacheDir?.Path;
        private static string? NativeLibsDir => AndroidCore.context.ApplicationInfo?.NativeLibraryDir;
        private Process? ServerProcess { get; set; }
        private CancellationTokenSource? CancelToken { get; set; }
        public static int AdbPort = 5037;
        public static AdbServer Instance { get; private set; } = new AdbServer();

        /// <summary>
        /// Path to the adb binary.
        /// </summary>
        public static string? AdbPath => NativeLibsDir != null ? Path.Combine(NativeLibsDir, "libadb.so") : null;

        /// <summary>
        /// If the server is running
        /// </summary>
        public bool IsRunning => ServerProcess != null && !ServerProcess.HasExited;

        private AdbServer() { }

        private async Task StartServerAsync(string arguments)
        {
            Debug.Assert(ServerProcess == null);
            Debug.Assert(CancelToken == null);

            var adbInfo = new ProcessStartInfo(AdbPath, arguments);
            adbInfo.WorkingDirectory = FilesDir;
            adbInfo.UseShellExecute = false;
            adbInfo.RedirectStandardOutput = true;
            adbInfo.RedirectStandardError = true;
            adbInfo.EnvironmentVariables["HOME"] = FilesDir;
            adbInfo.EnvironmentVariables["TMPDIR"] = CacheDir;
            adbInfo.EnvironmentVariables["ADB_MDNS"] = "0";
            adbInfo.EnvironmentVariables["ADB_MDNS_AUTO_CONNECT"] = "";

            Logger.Log("Starting adb server process from " + adbInfo.FileName + " with arguments " + adbInfo.Arguments);
            ServerProcess = Process.Start(adbInfo);

            if (ServerProcess == null)
            {
                Logger.Log("Adb server failed to start", LoggingType.Error);
                throw new Exception("adb server failed to start");
            }

            CancelToken?.Dispose();
            CancelToken = new CancellationTokenSource();
            CancelToken.Token.Register(() => ServerProcess.Kill());

            // Optionally log output/error asynchronously
            _ = Task.Run(async () =>
            {
                while (!ServerProcess.StandardError.EndOfStream)
                {
                    var line = await ServerProcess.StandardError.ReadLineAsync();
                    Logger.Log(line);
                }
            });
            _ = Task.Run(async () =>
            {
                while (!ServerProcess.StandardOutput.EndOfStream)
                {
                    var line = await ServerProcess.StandardOutput.ReadLineAsync();
                    Logger.Log(line);
                }
            });

            await ServerProcess.WaitForExitAsync();

            Logger.Log("Adb server exited", LoggingType.Error);
            DisposeVariables(false);
        }

        private void DisposeVariables(bool attemptKill)
        {
            if (attemptKill && ServerProcess != null && !ServerProcess.HasExited)
            {
                ServerProcess.Kill();
            }

            ServerProcess?.Dispose();
            ServerProcess = null;

            CancelToken?.Dispose();
            CancelToken = null;
        }

        /// <summary>
        /// Starts the server if not already running.
        /// </summary>
        public async Task StartAsync()
        {
            if (!IsRunning)
            {
                await StartServerAsync($"-P {AdbPort} server nodaemon");
            }
        }

        /// <summary>
        /// Stops the server if running.
        /// </summary>
        public void Stop(bool force = true) => DisposeVariables(force);

        public void Dispose() => Stop();

        public async Task PairAsync(string rPort, string rCode)
        {
            Stop(true);
            await StartServerAsync($"pair 127.0.0.1:{rPort} {rCode}");
        }
    }
}