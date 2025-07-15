using System;

namespace DanTheMan827.OnDeviceADB
{
    public class ExitInfo
    {
        public int ExitCode { get; init; }
        public string Output { get; init; }
        public string Error { get; init; }

        public override string ToString()
        {
            return $"Exit code: {ExitCode}\nOutput: {Output}\nError: {Error}";
        }
    }
}
