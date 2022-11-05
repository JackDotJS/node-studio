/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Type guard for unknown objects to see if they are actually a specific interface
 * @param obj Object to check
 * @param property Property that exists on T
 */
export default function isInterface<T>(obj: any, property: keyof T, log = false): obj is T {
  if (log)
    console.log(`[IS INTERFACE] OBJ:`, obj,
    `PROPERTY:`, property,
    `PROPERTY IN OBJ:`, property in obj);
  return property in obj;
}