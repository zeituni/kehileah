import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';

export interface Professional {
  name: string;
  group: string;
  phone: string;
  email: string;
  profession: string;
  details: string;
  website: string;
  social: string;
  preferredContact: string;
  category: string;
}

@Injectable()
export class ProfessionalsService {
  private readonly professionals: Professional[];

  constructor() {
    const csv = readFileSync(join(process.cwd(), 'data', 'professionals.csv'), 'utf8');
    const rows: string[][] = parse(csv, { bom: true, skip_empty_lines: true });
    // The packaged CSV contains source columns B–E, G–K, and L; source F is skipped.
    this.professionals = rows.slice(1)
      .map((row) => ({
        name: (row[0] || '').trim(),
        group: (row[1] || '').trim(),
        phone: (row[2] || '').trim(),
        email: (row[3] || '').trim(),
        profession: (row[4] || '').trim(),
        details: (row[5] || '').trim(),
        website: (row[6] || '').trim(),
        social: (row[7] || '').trim(),
        preferredContact: (row[8] || '').trim(),
        category: (row[9] || '').trim(),
      }))
      .filter((person) => person.profession.length > 0);
  }

  findAll(): Professional[] {
    return this.professionals;
  }
}
