import { applyDecorators } from '@nestjs/common';
import { Exclude, Transform } from 'class-transformer';

export function ExcludeField() {
    return applyDecorators(
        Exclude(),
        Transform(() => undefined, { toClassOnly: true }),
    );
}
