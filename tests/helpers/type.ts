export function mock<T>(mockObject: any = jest.fn()): T {
    return mockObject;
}
