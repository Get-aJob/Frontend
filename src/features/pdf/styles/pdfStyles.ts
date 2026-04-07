import { StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Pretendard',
  src: '/fonts/Pretendard-Regular.otf',
});
Font.register({
  family: 'Pretendard-Bold',
  src: '/fonts/Pretendard-Bold.otf',
});

export const styles = StyleSheet.create({
  page: {
    padding: '60px',
    fontFamily: 'Pretendard',
    fontSize: '9px',
    lineHeight: 1.6,
    color: '#333',
    backgroundColor: '#FFFFFF',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    paddingBottom: '12px',
    marginBottom: '24px',
  },
  userName: {
    fontSize: '22px',
    fontFamily: 'Pretendard-Bold',
    marginBottom: '20px',
    color: '#333',
  },
  headerLabel: {
    fontSize: '8px',
    color: '#888',
    marginBottom: '4px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontFamily: 'Pretendard-Bold',
    borderBottomWidth: 1.5,
    borderBottomColor: '#ddd',
    paddingBottom: '6px',
    marginBottom: '12px',
  },
  rowBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: '12px',
    fontFamily: 'Pretendard-Bold',
  },
  dateRange: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
    alignItems: 'center',
  },
  description: {
    marginTop: '4px',
    color: '#555',
  },
  badge: {
    fontSize: '8px',
    color: '#888',
    backgroundColor: '#f3f3f3',
    paddingHorizontal: '6px',
    paddingVertical: '2px',
    borderRadius: '4px',
  },
  twoColumn: {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    marginBottom: '24px',
  },
  columnItem: {
    flex: 1,
  },
  sectionItem: {
    flexGrow: 1,
  },
  link: {
    fontSize: '9px',
    color: '#4a90d9',
    marginLeft: '8px',
  },
  label: {
    fontSize: '9px',
    color: '#888',
  },
});
