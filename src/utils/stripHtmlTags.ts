const htmlEntities: { [key: string]: string } = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&quot;': '"',
  '&lt;': '<',
  '&gt;': '>',
};
export function stripHtmlTags(input: string): string {
  const textWithoutHtmlTags = input.replace(/<\/?[^>]+(>|$)/g, '');
  return textWithoutHtmlTags.replace(/&[^;]+;/g, entity => htmlEntities[entity] || entity);
}
