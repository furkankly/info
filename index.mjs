import chalk from "chalk";
import { format, subSeconds } from "date-fns";
import os from "os";
import { argv } from "process";

// Theme
const date = "hex('#cddc39')";
const text = "hex('#fbc02d')";
const data = "bgHex('#ffffff').hex('#d500f9')";
const error = "bgHex('#ffffff').hex('#b71c1c')";
const divider = "-----------------------------------------";

// Args
const validArgs = ["--memory", "--cpu", "--network"];
const considerArgs = argv.some((arg) =>
	validArgs.find((validArg) => validArg === arg)
);
const showMemoryStats = considerArgs ? argv.includes("--memory") : true;
const showCPUStats = considerArgs ? argv.includes("--cpu") : true;
const showNetworkInterfaces = considerArgs ? argv.includes("--network") : true;

// Data
const now = new Date();
const uptime = os.uptime();
const bootTime = subSeconds(now, uptime);

const kernelversion = os.version();
const hostname = os.hostname();
const home = os.homedir();

const totalram = (os.totalmem() / 1e9).toFixed(3);
const freeram = (os.freemem() / 1e9).toFixed(3);

const cpus = os.cpus();
const cpusCount = cpus.length;
const platform = os.platform(); // Load averages is only  a concept of linux systems
const loadaverages = os.loadavg();

const networkinterfaces = os.networkInterfaces();

const systemInfo = chalk`{${text}.italic System is booted at}: {${date} ${format(
	bootTime,
	"HH:mm dd/MMM/yy"
)}}
{${text}.bold Kernel version: {${data} ${kernelversion}}}
{${text}.bold Hostname}: {${text}.italic ${hostname}}
{${text}.bold Home}: {bgBlack.yellow.bold ${home}}\n`;

const memoryStats = chalk`\n{bold Memory}:
{${text}.bold Total RAM}: {${data}.bold ${totalram} GB} - {${text}.bold Free RAM}: {${data}.bold ${freeram} GB}${
	freeram < 3 ? `\n{${error} Low memory!}` : ""
}\n`;

const CPUStats = chalk`\n{bold CPUs}:
${cpus
	.map(
		(cpu, index) => chalk`{${text}.bold CPU${index}}: 
{${text}.bold Model: ${cpu.model}}
Speed: ${cpu.speed} MHz`
	)
	.join("\n")}
You have {${text}.bold ${cpusCount}} processing units in total.
Consider fixing the system especially if {${error}.bold ${cpusCount} - Average Load <= 0} in last 5 / 15 min.
${
	platform === "linux"
		? loadaverages
				.map(
					(average, index) =>
						chalk`{bold Average load in last ${
							index === 0 ? 1 : index === 1 ? 5 : 15
						} min.: ${average}}`
				)
				.join("\n")
		: ""
}\n`;

const networkInterfacesInfo = chalk`\n{bold Network Interfaces}:
${Object.entries(networkinterfaces)
	.map(
		([key, value]) =>
			chalk`\n{${text}.bold ${key}} ${value
				.map(
					(option, index) =>
						chalk`\n${index} - Address: ${option.address}\n    Netmask: ${option.netmask}\n    Family: ${option.family}\n    Mac: ${option.mac}\n    Scope id: ${option.scopeid}\n    Cidr: ${option.cidr}`
				)
				.join("\n")}`
	)
	.join("\n")}\n`;

console.log(
	systemInfo +
		(showMemoryStats ? divider + memoryStats : "") +
		(showCPUStats ? divider + CPUStats : "") +
		(showNetworkInterfaces ? divider + networkInterfacesInfo : "")
);
