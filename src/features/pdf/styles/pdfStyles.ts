import { StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Pretendard',
  src: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/packages/pretendard/dist/web/static/woff/Pretendard-Regular.woff',
});
Font.register({
  family: 'Pretendard-Bold',
  src: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/packages/pretendard/dist/web/static/woff/Pretendard-Bold.woff',
});

export const styles = StyleSheet.create({
  page: {
    padding: '60px',
    fontFamily: 'Pretendard',
    fontSize: '8px',
    lineHeight: 1.5,
    color: '#333',
    width: '100%',
  },
  section: {
    marginBottom: '26px',
  },
  dateRange: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
  },
  sectionItem: {
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: '11px',
    fontFamily: 'Pretendard-Bold',
    color: '#333',
    marginBottom: '4px',
  },
});
