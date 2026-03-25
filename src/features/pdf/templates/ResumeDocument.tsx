import type { ResumeFormInputs } from '@/types/ResumeFormType';
import { styles } from '../styles/pdfStyles';
import { Document, Page, Text, View } from '@react-pdf/renderer';

const ResumeDocument = ({ data }: { data: ResumeFormInputs }) => (
  <Document title={data.title || 'resume'}>
    <Page size="A4" style={styles.page}>
      <View style={{ ...styles.section, minHeight: '100px' }}>
        <Text style={styles.sectionTitle}>간단소개</Text>
        <Text>{data.profile}</Text>
      </View>
      <View style={{ ...styles.section, minHeight: '100px' }}>
        <Text style={styles.sectionTitle}>경험 / 경력</Text>
        {data.experience
          .filter((e) => e.name)
          .map((e) => (
            <View key={e.name}>
              <View style={styles.dateRange}>
                <Text>{e.name}</Text>
                <Text>{String(e.period.startDate)}</Text>
                <Text>-</Text>
                <Text>{e.period.endDate ? String(e.period.endDate) : '현재 진행중'}</Text>
                <Text>|</Text>
                <Text>{e.position}</Text>
              </View>
              <Text>{e.description}</Text>
            </View>
          ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>스킬</Text>
        <Text>{data.skill}</Text>
      </View>
      <View style={{ ...styles.section, minHeight: '100px' }}>
        <Text style={styles.sectionTitle}>학력</Text>
        {data.education
          .filter((e) => e.name)
          .map((e) => (
            <View key={e.name} style={{ marginBottom: '4px' }}>
              <View style={styles.dateRange}>
                <Text>{e.name}</Text>
                <Text>{String(e.period.startDate)}</Text>
                <Text>-</Text>
                <Text>{e.period.endDate ? String(e.period.endDate) : '현재 진행중'}</Text>
              </View>
              <Text>{e.description}</Text>
            </View>
          ))}
      </View>
      <View
        style={{
          ...styles.section,
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          gap: '10px',
          justifyContent: 'space-between',
        }}
      >
        <View style={styles.sectionItem}>
          <Text style={{ ...styles.sectionTitle, borderBottomWidth: 1, borderBottomColor: '#000' }}>
            수상/자격증/기타
          </Text>
          {data.additionalInfo
            .filter((a) => a.name)
            .map((a) => (
              <View key={a.name} style={{ marginBottom: '2px' }}>
                <Text>{a.name}</Text>
                <View>
                  <Text>{String(a.date)}</Text>
                  <Text>{a.type}</Text>
                </View>
                <Text>{a.description}</Text>
              </View>
            ))}
        </View>
        <View style={styles.sectionItem}>
          <Text style={{ ...styles.sectionTitle, borderBottomWidth: 1, borderBottomColor: '#000' }}>
            언어
          </Text>
          {data.language
            .filter((l) => l.name)
            .map((l) => (
              <View key={l.name} style={{ marginBottom: '2px' }}>
                <View>
                  <Text>{l.name}</Text>
                  <Text>{l.level}</Text>
                </View>
                {l.test.map((t) => (
                  <View key={t.testName} style={{ marginBottom: '2px' }}>
                    <View>
                      <Text>{t.testName}</Text>
                      <Text>{t.score}</Text>
                    </View>
                    <Text>{String(t.date)}</Text>
                  </View>
                ))}
              </View>
            ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>포트폴리오</Text>
        {data.portfolio
          .filter((p) => p.name && p.type !== 'file')
          .map((p) => (
            <View key={p.name} style={{ marginBottom: '2px' }}>
              <Text>{p.name}</Text>
              <Text>{p.url || ''}</Text>
            </View>
          ))}
      </View>
    </Page>
  </Document>
);

export default ResumeDocument;
