/**
 *
 * @param textArea HTMLTextAreaElement
 * @param hiddenDiv HTMLDivElement hidden div to get height
 *
 * copy textArea content to div which have auto height then copy div height to textArea
 */
export const textareaAutoHeight = (
  textArea: HTMLTextAreaElement,
  hiddenDiv: HTMLDivElement
): void => {
  let content = null;
  textArea?.addEventListener("input", () => {
    content = textArea.value;
    hiddenDiv.innerHTML = content;

    hiddenDiv.style.visibility = "hidden";
    hiddenDiv.style.display = "block";
    textArea.style.height = hiddenDiv.offsetHeight + "px";

    hiddenDiv.style.visibility = "visible";
    hiddenDiv.style.display = "none";
  });
};
