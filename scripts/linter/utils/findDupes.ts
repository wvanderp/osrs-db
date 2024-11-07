export default function findDupes<T>(arr: T[]): T[] {
    return arr.filter((value, index, self) => self.indexOf(value) !== index);
}
