import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

export interface PythonBridgeResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    details?: string;
}

export class AIBridge {
    private static executionDir = path.join(process.cwd(), 'execution');

    /**
     * Run a Python script from the execution directory
     * @param scriptName Name of the script (e.g., 'enrich_lead.py')
     * @param args Key-value pairs of arguments to pass to the script
     */
    static async runPythonScript<T = any>(
        scriptName: string,
        args: Record<string, string | number | boolean | undefined | null>
    ): Promise<PythonBridgeResponse<T>> {
        try {
            const scriptPath = path.join(this.executionDir, scriptName);

            const scriptArgs: string[] = [];

            for (const [key, value] of Object.entries(args)) {
                if (value !== undefined && value !== null) {
                    scriptArgs.push(`--${key}`, String(value));
                }
            }

            console.log(`[AIBridge] Executing: python ${scriptPath} ${scriptArgs.join(' ')}`);

            const { stdout, stderr } = await execFileAsync('python', [scriptPath, ...scriptArgs]);

            if (stderr && !stdout) {
                console.error(`[AIBridge] Script stderr: ${stderr}`);
                return {
                    success: false,
                    error: 'Script execution failed',
                    details: stderr
                };
            }

            try {
                const data = JSON.parse(stdout);
                return {
                    success: true,
                    data
                };
            } catch (parseError) {
                console.error(`[AIBridge] Failed to parse script output: ${stdout}`);
                return {
                    success: false,
                    error: 'Invalid script output',
                    details: stdout
                };
            }
        } catch (error: any) {
            console.error(`[AIBridge] Execution exception:`, error);
            return {
                success: false,
                error: 'Terminal execution error',
                details: error.message
            };
        }
    }
}
