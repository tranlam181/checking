export function Interval(time: number, setIntervalToken: (token: any) => void) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    // add name for anonymous function
    Object.defineProperty(descriptor.value, "name", { value: propertyKey });

    descriptor.value = async function (...args: any[]) {
      const intervalToken = setInterval(() => {
        originalMethod.apply(this, args);
      }, time);
      setIntervalToken(intervalToken);
    };

    return descriptor;
  };
}
