
export class FileUtils {
    public static fromData(data: any, name: string): any {
        try {
            return new File([data], name);
        } catch (e) { // workaround for edge
            const file = new Blob([data]);
            file['lastModifiedDate'] = new Date();
            file['name'] = name;
            return file;
        }
    }
}
