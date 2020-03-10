const class_pattern = /\s*public class (?<name>\w+) (?:extends (?<parent>\w+) )?implements (?<interface>\w+)\n/
const protocolID_pattern = /\s*public static const protocolId:uint = (?<id>\d+);\n/
const public_variables = /\s*public var (?<name>\w+):(?<type>\S*)( = (?<init>.*))?;\n/