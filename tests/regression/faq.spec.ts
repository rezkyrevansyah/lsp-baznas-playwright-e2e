import { test, expect } from '../../fixtures';
import content from '../../test-data/site-content.json';

test.describe('FAQ accordion', { tag: '@regression' }, () => {
  test.beforeEach(async ({ faqPage }) => {
    await faqPage.open();
  });

  test('TC-FAQ-01 lists all questions, numbered, with only the first one expanded', async ({
    faqPage,
  }) => {
    await expect(faqPage.questions).toHaveCount(content.faqQuestionCount);

    const texts = await faqPage.questions.allInnerTexts();
    texts.forEach((text, i) => expect.soft(text.trim()).toMatch(new RegExp(`^${i + 1}\\.`)));

    for (let i = 0; i < content.faqQuestionCount; i++) {
      const expanded = i === 0 ? 'true' : 'false';
      await expect.soft(faqPage.question(i)).toHaveAttribute('aria-expanded', expanded);
    }
  });

  test('TC-FAQ-02 first answer is shown by default', async ({ faqPage }) => {
    const answer = await faqPage.answer(0);
    await expect(answer).toBeVisible();
    await expect(answer).toContainText(content.firstFaqAnswerSnippet);
  });

  test('TC-FAQ-03 opening another question collapses the previous one', async ({ faqPage }) => {
    await faqPage.toggle(1);
    await expect(await faqPage.answer(1)).toBeVisible();
    await expect(await faqPage.answer(0)).toBeHidden();

    await faqPage.toggle(2);
    await expect(await faqPage.answer(2)).toBeVisible();
    await expect(await faqPage.answer(1)).toBeHidden();
    await expect(faqPage.question(1)).toHaveAttribute('aria-expanded', 'false');
  });

  test('TC-FAQ-04 clicking an open question collapses it again', async ({ faqPage }) => {
    await faqPage.toggle(3);
    await expect(await faqPage.answer(3)).toBeVisible();

    await faqPage.toggle(3);
    await expect(await faqPage.answer(3)).toBeHidden();
  });
});
