// Returns the parsed config line with an obj containing the key, and the comma separated values

import { Config } from "../types/identifiers";

// If the key is param, the key becomes param.paramName and values becomes an array with 1 item => [ paramvalue ]
export function parseConfigLine(line: string): Config | undefined {
  const split = line.split('=');
  if (split.length === 2) {
    const values = split[1].split(',');
    return (split[0] === 'param') ? {key: `param.${values[0]}`, values: [values[1]]} : {key: split[0], values: values};
  }
  return undefined;
}

export function getIdentifierLines(fileLines: string[]): {[identifierId: string]: string[]} {
  let identifierId: string | undefined = undefined;
  const response: {[identifierId: string]: string[]}  = {};
  for (const line of fileLines) {
    if (line === '' || line.startsWith('//')) continue;
    if (/\[\w+\]/.test(line)) {
      identifierId = line.substring(1, line.indexOf(']'));
      response[identifierId] = [];
    }
    else if (identifierId) {
      response[identifierId].push(line);
    }
  }
  return response;
}

export function mapBooleanValue(values: string[]) {
  if (!values || !values[0]) {
    return false;
  }
  if (values[0] === '^true' || values[0] === 'yes' || values[0] === 'true') {
    return true;
  }
  return false;
}

export function divideBy1000(values: string[]) {
  return Number(values[0]) / 1000;
}
