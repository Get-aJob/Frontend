export default {
  rules: {
    'type-enum': [
      2,
      'always',
      ['Feat', 'Fix', 'Docs', 'Style', 'Refactor', 'Test', 'Deploy', 'Chore', 'Merge'],
    ],
    'type-case': [0],
    'subject-empty': [2, 'never'],
    'subject-case': [0],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^.+\s(Feat|Fix|Docs|Style|Refactor|Test|Deploy|Chore|Merge)\s*:\s*(.+)$/,
      headerCorrespondence: ['type', 'subject'],
    },
  },
};
