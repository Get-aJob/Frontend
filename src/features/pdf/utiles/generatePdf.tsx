import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import ResumeDocument from '../templates/ResumeDocument';
import type { ResumeFormInputs } from '@/types/ResumeFormType';

export const downloadResumePdf = async (data: ResumeFormInputs) => {
  let blob: Blob | null = null;
  try {
    const doc = <ResumeDocument data={data} />;
    blob = await pdf(doc).toBlob();

    // 2. 파일 다운로드 실행
    saveAs(blob, `${data.title}.pdf`);
  } catch (error) {
    console.log(error);
  }
};

export const downloadPortfolio = async (file: File | string | undefined, title: string) => {
  try {
    if (file instanceof File) {
      saveAs(file, file.name);
    } else if (typeof file === 'string') {
      const arrayBuffer = await fetch(file).then((r) => r.arrayBuffer());
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      saveAs(blob, title);
    }
  } catch (error) {
    console.log(error);
  }
};
