import type { ResumeFormInputs } from '@/types/ResumeFormType';
import { styles } from '../styles/pdfStyles';
import { Document, Page, Text, View } from '@react-pdf/renderer';

const formatDate = (date: Date | null) => {
  if (!date) return '';
  return new Date(date)
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
    })
    .replace(/\. /g, '.')
    .replace('.', '년 ')
    .replace('.', '월');
  // 결과: "2024년 01월"
};

const DateRange = ({ start, end }: { start: Date | null; end: Date | null }) => (
  <Text style={styles.label}>
    {formatDate(start)} - {end ? formatDate(end) : '현재 진행중'}
  </Text>
);

interface ResumeDocumentProps {
  data?: ResumeFormInputs;
  userName?: string;
}

const ResumeDocument = ({ data, userName }: ResumeDocumentProps) => {
  if (!data) return;

  return (
    <Document title={data.title || 'resume'}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {userName && <Text style={styles.userName}>{userName}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>간단 소개</Text>
          <Text>{data.profile}</Text>
        </View>

        {/* 경험 / 경력 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>경험 / 경력</Text>
          {data.experience
            .filter((e) => e.name)
            .map((e) => (
              <View key={e.name} style={{ marginBottom: '8px' }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.description}>{e.name}</Text>
                  <View style={styles.dateRange}>
                    <DateRange start={e.period.startDate} end={e.period.endDate} />
                    <Text style={styles.label}> | {e.position}</Text>
                  </View>
                </View>
                <Text style={styles.description}>{e.description}</Text>
              </View>
            ))}
        </View>

        {/* 스킬 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>스킬</Text>
          <Text style={styles.description}>{data.skill}</Text>
        </View>

        {/* 학력 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>학력</Text>
          {data.education
            .filter((e) => e.name)
            .map((e) => (
              <View key={e.name} style={{ marginBottom: '8px' }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemTitle}>{e.name}</Text>
                  <DateRange start={e.period.startDate} end={e.period.endDate} />
                </View>
                <Text style={styles.description}>{e.description}</Text>
              </View>
            ))}
        </View>

        {/* 수상/자격증 + 언어 2단 */}
        <View style={styles.twoColumn}>
          <View style={styles.sectionItem}>
            <Text style={styles.sectionTitle}>수상/자격증/기타</Text>
            {data.additionalInfo
              .filter((a) => a.name)
              .map((a) => (
                <View key={a.name} style={{ marginBottom: '6px' }}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.description}>{a.name}</Text>
                    <Text style={styles.badge}>{a.type}</Text>
                  </View>
                  <Text style={styles.label}>{formatDate(a.date)}</Text>
                  <Text style={styles.description}>{a.description}</Text>
                </View>
              ))}
          </View>

          <View style={styles.sectionItem}>
            <Text style={styles.sectionTitle}>언어</Text>
            {data.language
              .filter((l) => l.name)
              .map((l) => (
                <View key={l.name} style={{ marginBottom: '6px' }}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.description}>{l.name}</Text>
                    <Text style={styles.label}>{l.level}</Text>
                  </View>
                  {l.test
                    .filter((t) => t.testName)
                    .map((t) => (
                      <View key={t.testName} style={styles.dateRange}>
                        <Text style={styles.label}>{t.testName}</Text>
                        <Text style={styles.label}>
                          {t.score} · {formatDate(t.date)}
                        </Text>
                      </View>
                    ))}
                </View>
              ))}
          </View>
        </View>

        {/* 포트폴리오 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>포트폴리오</Text>
          {data.portfolio
            .filter((p) => p.name && p.type !== 'file')
            .map((p) => (
              <View key={p.name} style={{ marginBottom: '4px' }}>
                <Text style={styles.itemTitle}>{p.name}</Text>
                <Text style={styles.link}>{p.url || ''}</Text>
              </View>
            ))}
        </View>
      </Page>
    </Document>
  );
};

export default ResumeDocument;
