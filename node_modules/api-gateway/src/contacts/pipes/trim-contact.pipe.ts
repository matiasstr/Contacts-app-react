import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class TrimContactPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'object' || value === null) return value;
    const out: any = {};
    for (const key of Object.keys(value)) {
      const v = value[key];
      out[key] = typeof v === 'string' ? v.trim() : v;
    }
    return out;
  }
}
