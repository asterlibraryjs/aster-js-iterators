
function *asIterable<T>(array: readonly T[]): Iterable<T> {
    for (const item of array) {
        yield item;
    }
}
export async function *asAsyncIterable<T>(array: readonly T[]): AsyncIterable<T> {
    for (const item of array) {
        yield await Promise.resolve(item);
    }
}

export const ArrayOfZer0 = Array<number>(105).fill(0) as readonly number[];
export const IterableOfZer0 = () => asIterable(ArrayOfZer0);
export const AsyncIterableOfZer0 = () => asAsyncIterable(ArrayOfZer0);


export const ArrayOfInt = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0] as const;
export const IterableOfInt = () => asIterable(ArrayOfInt);
export const AsyncIterableOfInt = () => asAsyncIterable(ArrayOfInt);

export const ArrayOfCattle = [{ id: 122, value: "cow" }, { id: 78112, value: "bull" }, { id: 46541, value: "cow" }, { id: 4954, value: "cow" }, { id: 45634, value: "bull" }];
export const IterableOfCattle = () => asIterable(ArrayOfCattle);
export const AsyncIterableOfCattle = () => asAsyncIterable(ArrayOfCattle);

export const Item1 = {
    id: 97,
    firstName: "Jesse",
    lastName: "Pinkman",
    email: "jessep420@gmail.com",
    gender: "Male",
    ipAddress: "25.237.165.96"
} as const;

export const Item2 = {
    id: 97,
    firstName: "Walter",
    lastName: "White",
    email: "heisenberg@hotmail.com",
    gender: "Male",
    ipAddress: "25.237.165.96"
} as const;

export const Item3 = {
    id: 97,
    firstName: "Hank",
    lastName: "Schrader",
    email: "hank@outlook.com",
    gender: "Male",
    ipAddress: "25.237.165.96"
} as const;

export const Item4 = {
    id: 97,
    firstName: "Saul",
    lastName: "Goodman",
    email: "goodman-attorney@gmail.com",
    gender: "Male",
    ipAddress: "25.237.165.96"
} as const;

export const Item5 = {
    id: 97,
    firstName: "Walter Jr.",
    lastName: "White",
    email: "flynn@gmail.com",
    gender: "Male",
    ipAddress: "25.237.165.96"
} as const;

export const Item6 = {
    id: 97,
    firstName: "Skyler",
    lastName: "White",
    email: "skyler-white298@hotmail.com",
    gender: "Female",
    ipAddress: "25.237.165.96"
} as const;

export const Item7 = {
    id: 97,
    firstName: "Gus",
    lastName: "Fring",
    email: "gus-fring@lospolloshermanos.com",
    gender: "Male",
    ipAddress: "25.237.165.96"
} as const;


export const ArrayOfObjects = [Item1, Item2, Item3, Item4, Item5, Item6, Item7] as const;
export const IterableOfObjects = () => asIterable(ArrayOfObjects);
export const AsyncIterableOfObjects = () => asAsyncIterable(ArrayOfObjects);
