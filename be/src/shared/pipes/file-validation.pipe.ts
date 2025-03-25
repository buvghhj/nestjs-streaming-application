import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ReadStream } from "fs";
import { validateFileFormat, validateFileSize } from "../utils/validate-file.util";

@Injectable()
export class FileValidationPipe implements PipeTransform {

    public async transform(value: any, metadata: ArgumentMetadata) {

        if (!value.filename) {

            throw new BadRequestException('Không có file nào được tải lên!')

        }

        const { filename, createReadStream } = value

        const fileStream = createReadStream() as ReadStream

        const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif']

        const isFileFormatValid = validateFileFormat(filename, allowedFormats)

        if (!isFileFormatValid) {

            throw new BadRequestException('Định dạng file không được hỗ trợ!')

        }

        const isFileSizeValid = await validateFileSize(fileStream, 10 * 1024 * 1024)

        if (!isFileSizeValid) {

            throw new BadRequestException('Kích thước tập tin không vượt quá 10mb!')

        }

        return value

    }

}