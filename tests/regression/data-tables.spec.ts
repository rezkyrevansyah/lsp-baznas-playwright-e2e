import { test, expect } from '../../fixtures';
import content from '../../test-data/site-content.json';
import { SHORT_DATE } from '../../utils/helpers';
import type { DataTablePage } from '../../pages/DataTablePage';

/** 1-based column positions in the Jadwal table. */
const JADWAL_COLUMN = { startDate: 3, quota: 5, status: 6 } as const;

type TableCase = {
  name: string;
  fixture: 'asesorPage' | 'jadwalPage' | 'tukPage';
  headers: string[];
  /** 1-based column used for the search test. */
  searchColumn: number;
};

const tables: TableCase[] = [
  {
    name: 'Asesor Kompetensi',
    fixture: 'asesorPage',
    headers: content.tableHeaders.asesor,
    searchColumn: 2,
  },
  {
    name: 'Jadwal Uji Kompetensi',
    fixture: 'jadwalPage',
    headers: content.tableHeaders.jadwal,
    searchColumn: 2,
  },
  {
    name: 'Tempat Uji Kompetensi',
    fixture: 'tukPage',
    headers: content.tableHeaders.tuk,
    searchColumn: 2,
  },
];

for (const t of tables) {
  test.describe(`${t.name} table`, { tag: '@regression' }, () => {
    let table: DataTablePage;

    test.beforeEach(async ({ asesorPage, jadwalPage, tukPage }) => {
      table = { asesorPage, jadwalPage, tukPage }[t.fixture];
      await table.open();
      await expect(table.table).toBeVisible();
    });

    test('TC-TABLE-01 renders expected column headers', async () => {
      expect(await table.headerTexts()).toEqual(t.headers);
    });

    test('TC-TABLE-02 shows at most 10 rows by default and reports total entries', async () => {
      const total = await table.totalEntries();
      expect(total).toBeGreaterThan(0);
      await expect(table.rows).toHaveCount(Math.min(10, total));
      await expect(table.info).toContainText(/Showing 1 to \d+ of \d+ entries/);
    });

    test('TC-TABLE-03 search filters rows by keyword', async () => {
      // The full cell value is specific enough to filter; a prefix like "TUK Mandiri" can match every row.
      const [firstValue] = await table.columnValues(t.searchColumn);
      const keyword = firstValue.trim().replace(/\s+/g, ' ');

      await table.search(keyword);

      await expect(table.info).toContainText('filtered from');
      const values = await table.columnValues(t.searchColumn);
      expect(values.length).toBeGreaterThan(0);
      // DataTables searches across all columns, so check the whole row text.
      const rowTexts = await table.rows.allInnerTexts();
      for (const row of rowTexts) {
        expect.soft(row.toLowerCase()).toContain(keyword.toLowerCase());
      }
    });

    test('TC-TABLE-04 search with an unknown keyword shows the empty state', async () => {
      await table.search('zzz-tidak-ada-data-zzz');
      await expect(table.emptyRow).toHaveText(/No matching records found/i);
      await expect(table.info).toContainText('Showing 0 to 0 of 0 entries');
    });

    test('TC-TABLE-05 pagination moves to the next page when more than 10 entries exist', async () => {
      const total = await table.totalEntries();
      test.skip(total <= 10, 'Only one page of data');

      await table.nextButton.click();
      await expect(table.info).toContainText(/Showing 11 to \d+ of/);
    });

    test('TC-TABLE-06 page length selector shows more rows', async () => {
      const total = await table.totalEntries();
      await table.pageLength.selectOption('25');
      await expect(table.rows).toHaveCount(Math.min(25, total));
    });
  });
}

test.describe('Jadwal Uji Kompetensi – data format', { tag: '@regression' }, () => {
  test('TC-JADWAL-01 dates use "DD Mon YYYY" format and status is not empty', async ({
    jadwalPage,
  }) => {
    await jadwalPage.open();
    const startDates = await jadwalPage.columnValues(JADWAL_COLUMN.startDate);
    const statuses = await jadwalPage.columnValues(JADWAL_COLUMN.status);

    for (const date of startDates) expect.soft(date.trim()).toMatch(SHORT_DATE);
    for (const status of statuses) expect.soft(status.trim()).not.toBe('');
  });

  test('TC-JADWAL-02 participant quota is a non-negative number', async ({ jadwalPage }) => {
    await jadwalPage.open();
    for (const quota of await jadwalPage.columnValues(JADWAL_COLUMN.quota)) {
      // Rendered as e.g. "20 Orang".
      expect.soft(quota.trim()).toMatch(/^\d+(\s+Orang)?$/i);
    }
  });
});
