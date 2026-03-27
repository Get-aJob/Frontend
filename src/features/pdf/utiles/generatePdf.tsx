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
  } finally {
    blob = null;
  }
};
