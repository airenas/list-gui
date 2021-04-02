
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

    public static hasExtension(filename: string, extensions: string[]): boolean {
        const lfn = (filename || '').toLowerCase();
        for (const ext of extensions) {
            if (lfn.endsWith(ext)) {
                return true;
            }
        }
        return false;
    }
}
