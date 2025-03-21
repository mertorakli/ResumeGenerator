import { Document, Page, Text, View, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer'

/**
 * This file handles PDF generation for resumes
 * 
 * IMPORTANT: We've registered fonts with full Unicode support to ensure 
 * proper display of special characters from different languages,
 * particularly Turkish characters like ğ, ı, ş, ç, ö, ü, and İ.
 * 
 * The following fonts are used:
 * - Noto Sans: Excellent Unicode support with all Turkish characters
 * - Open Sans: Good support for special characters
 * - Times New Roman: Better alternative to the default Times font
 */

// Register fonts that support Turkish characters
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 700 },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-italic.ttf', fontStyle: 'italic' },
  ]
});

// Register Times font alternatives with better character support
Font.register({
  family: 'Times New Roman',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/web/standard_fonts/Times-Roman.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/web/standard_fonts/Times-Bold.ttf', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/web/standard_fonts/Times-Italic.ttf', fontStyle: 'italic' },
  ]
});

// Use Noto Sans for excellent Unicode support, including Turkish characters
Font.register({
  family: 'Noto Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@4.5.0/files/noto-sans-all-400-normal.woff' },
    { src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@4.5.0/files/noto-sans-all-700-normal.woff', fontWeight: 700 },
    { src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@4.5.0/files/noto-sans-all-400-italic.woff', fontStyle: 'italic' },
  ]
});

type StyleDefinitions = {
  page: {
    flexDirection: 'row' | 'column';
    backgroundColor: string;
    padding: string | number;
    fontFamily: string;
  };
  section: {
    marginBottom: number;
  };
  header: {
    fontSize: number;
    marginBottom: number;
    fontFamily?: string;
    textAlign?: 'left' | 'right' | 'center' | 'justify';
    color?: string;
  };
  contactInfo?: {
    flexDirection?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
    marginBottom?: number;
    fontSize?: number;
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    gap?: number;
  };
  contactItem?: {
    marginHorizontal?: number;
    fontSize?: number;
    marginBottom?: number;
    color?: string;
    flexDirection?: 'row' | 'column';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    gap?: number;
  };
  sectionTitle: {
    fontSize: number;
    marginBottom: number;
    fontFamily?: string;
    borderBottomWidth?: number;
    borderBottomColor?: string;
    borderBottomStyle?: 'solid' | 'dashed' | 'dotted';
    paddingBottom?: number;
    color?: string;
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  };
  experienceItem: {
    marginBottom: number;
  };
  jobTitle: {
    fontSize: number;
    fontFamily?: string;
    color?: string;
    marginBottom?: number;
  };
  jobDetails: {
    fontSize: number;
    marginBottom: number;
    flexDirection?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
    color?: string;
  };
  jobLocation?: {
    fontSize: number;
    fontFamily?: string;
    color?: string;
  };
  jobDescription: {
    fontSize: number;
    lineHeight: number;
    marginLeft?: number;
    color?: string;
  };
  bulletPoint: {
    width: number;
    fontSize: number;
    marginRight: number;
    color?: string;
  };
  bulletContainer: {
    flexDirection: 'row' | 'column';
    alignItems: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    marginBottom: number;
  };
  skillsContainer: {
    flexDirection: 'row' | 'column';
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    gap?: number;
  };
  skillsSection?: {
    marginTop?: number;
  };
  skillCategory?: {
    fontSize: number;
    fontFamily?: string;
    color?: string;
    marginBottom?: number;
  };
  skillList: {
    fontSize: number;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    marginBottom?: number;
    borderRadius?: number;
  };
  degree?: {
    fontSize: number;
    fontFamily?: string;
    color?: string;
  };
  school?: {
    fontSize: number;
    flexDirection?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  };
  coursework?: {
    fontSize: number;
    marginTop?: number;
  };
  courseworkTitle?: {
    fontSize: number;
    fontFamily?: string;
    marginBottom?: number;
  };
  courseworkList?: {
    flexDirection: 'row' | 'column';
    flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse';
    gap: number;
  };
  courseworkItem?: {
    fontSize: number;
  };
  languageSection?: {
    marginTop?: number;
    marginBottom?: number;
  };
  languageItem?: {
    fontSize: number;
    marginBottom?: number;
    color?: string;
  };
  languageLevel?: {
    fontSize: number;
    fontStyle?: 'normal' | 'italic' | 'oblique';
    color?: string;
  };
  leftColumn?: {
    width: string;
    backgroundColor: string;
    padding: number;
    color: string;
  };
  rightColumn?: {
    width: string;
    padding: number;
  };
  subHeader?: {
    fontSize: number;
    color?: string;
    marginBottom?: number;
  };
  rightSectionTitle?: {
    fontSize: number;
    marginBottom?: number;
    color?: string;
    fontFamily?: string;
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  };
  jobSubTitle?: {
    fontSize: number;
    color?: string;
    marginBottom?: number;
  };
  dateRange?: {
    fontSize: number;
    color?: string;
    marginBottom?: number;
  };
  achievementContainer?: {
    marginTop?: number;
  };
  customSection?: {
    marginBottom: number;
  };
  sectionDescription?: {
    fontSize: number;
    marginLeft: number;
    color?: string;
  };
}

const professionalStyles: StyleDefinitions = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: '40 60',
    fontFamily: 'Noto Sans',
  },
  section: {
    marginBottom: 15,
  },
  header: {
    fontSize: 28,
    marginBottom: 4,
    fontFamily: 'Noto Sans',
    textAlign: 'center',
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    fontSize: 11,
    flexWrap: 'wrap',
    gap: 15,
  },
  contactItem: {
    marginHorizontal: 5,
    fontSize: 11,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Noto Sans',
    fontWeight: 700,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    paddingBottom: 2,
  },
  experienceItem: {
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 12,
    fontFamily: 'Noto Sans',
    fontStyle: 'italic',
  },
  jobDetails: {
    fontSize: 12,
    marginBottom: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobLocation: {
    fontSize: 12,
    fontFamily: 'Noto Sans',
    fontStyle: 'italic',
  },
  jobDescription: {
    fontSize: 12,
    lineHeight: 1.4,
    marginLeft: 10,
  },
  bulletPoint: {
    width: 3,
    fontSize: 12,
    marginRight: 7,
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillsSection: {
    marginTop: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillList: {
    fontSize: 11,
    width: '48%',
    marginBottom: 5,
  },
  degree: {
    fontSize: 12,
    fontFamily: 'Noto Sans',
    fontStyle: 'italic',
  },
  school: {
    fontSize: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coursework: {
    fontSize: 12,
    marginTop: 4,
  },
  courseworkTitle: {
    fontSize: 12,
    fontFamily: 'Noto Sans',
    fontWeight: 700,
    marginBottom: 2,
  },
  courseworkList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  courseworkItem: {
    fontSize: 12,
  },
  languageSection: {
    marginTop: 5,
    marginBottom: 5,
  },
  languageItem: {
    fontSize: 11,
    marginBottom: 2,
  },
  languageLevel: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#666',
  },
  customSection: {
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 12,
    marginLeft: 10,
  },
}) as StyleDefinitions;

const creativeStyles: StyleDefinitions = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 0,
    fontFamily: 'Open Sans',
  },
  leftColumn: {
    width: '30%',
    backgroundColor: '#2D3748',
    padding: 20,
    color: '#fff',
  },
  rightColumn: {
    width: '70%',
    padding: 30,
  },
  section: {
    marginBottom: 25,
  },
  header: {
    fontSize: 24,
    marginBottom: 4,
    color: '#000',
    fontFamily: 'Open Sans',
    fontWeight: 700,
  },
  subHeader: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 15,
  },
  contactInfo: {
    marginBottom: 20,
  },
  contactItem: {
    fontSize: 10,
    marginBottom: 8,
    color: '#718096',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 15,
    color: '#fff',
    fontFamily: 'Open Sans',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  rightSectionTitle: {
    fontSize: 16,
    marginBottom: 15,
    color: '#2D3748',
    fontFamily: 'Open Sans',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  experienceItem: {
    marginBottom: 20,
  },
  jobTitle: {
    fontSize: 14,
    color: '#2D3748',
    fontFamily: 'Open Sans',
    fontWeight: 700,
    marginBottom: 4,
  },
  jobSubTitle: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 8,
  },
  jobDetails: {
    fontSize: 11,
    color: '#4A5568',
    marginBottom: 4,
  },
  jobLocation: {
    fontSize: 11,
    color: '#718096',
  },
  jobDescription: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#4A5568',
    marginLeft: 10,
  },
  bulletPoint: {
    width: 4,
    fontSize: 11,
    marginRight: 6,
    color: '#4A5568',
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  skillsSection: {
    marginTop: 0,
  },
  skillCategory: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 8,
  },
  skillList: {
    fontSize: 11,
    color: '#fff',
    backgroundColor: '#4A5568',
    padding: '4 8',
    marginBottom: 6,
    borderRadius: 4,
  },
  skillsContainer: {
    flexDirection: 'column',
  },
  languageSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  languageItem: {
    fontSize: 11,
    color: '#fff',
    marginBottom: 4,
  },
  languageLevel: {
    fontSize: 10,
    color: '#A0AEC0',
    fontStyle: 'italic',
  },
  achievementContainer: {
    marginTop: 8,
  },
  dateRange: {
    fontSize: 11,
    color: '#718096',
    marginBottom: 4,
  },
})

const minimalStyles: StyleDefinitions = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 40,
    fontFamily: 'Open Sans',
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    marginBottom: 5,
    color: '#000',
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
    fontSize: 11,
    flexWrap: 'wrap',
    gap: 20,
  },
  contactItem: {
    marginRight: 10,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: '#000',
    fontFamily: 'Open Sans',
    fontWeight: 700,
    borderBottom: 0.5,
    borderBottomColor: '#ccc',
    paddingBottom: 4,
  },
  experienceItem: {
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 13,
    color: '#000',
  },
  jobDetails: {
    fontSize: 11,
    marginBottom: 4,
    color: '#666',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobLocation: {
    fontSize: 11,
    color: '#666',
  },
  jobDescription: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#333',
    marginLeft: 10,
  },
  bulletPoint: {
    width: 3,
    fontSize: 11,
    marginRight: 7,
    color: '#333',
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillsSection: {
    marginTop: 2,
  },
  skillList: {
    fontSize: 11,
    color: '#333',
  },
  degree: {
    fontSize: 13,
    color: '#000',
  },
  school: {
    fontSize: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  languageItem: {
    fontSize: 11,
    color: '#333',
    marginBottom: 2,
  },
  languageLevel: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#666',
  },
})

export const ResumeDocument = ({ data, template = 'professional' }: { data: any, template?: string }) => {
  const getStyles = () => {
    switch (template) {
      case 'creative':
        return creativeStyles
      case 'minimal':
        return minimalStyles
      default:
        return professionalStyles
    }
  }

  const styles = getStyles()

  const renderBulletPoint = (text: string) => (
    <View style={styles.bulletContainer}>
      <Text style={styles.bulletPoint}>•</Text>
      <Text style={styles.jobDescription}>{text}</Text>
    </View>
  )

  if (template === 'creative') {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.leftColumn}>
            {data.skills && data.skills.length > 0 && data.skills.some((skill: string) => skill.trim() !== '') && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.skillsContainer}>
                  {data.skills.map((skill: string, index: number) => (
                    skill.trim() !== '' && (
                      <Text key={index} style={styles.skillList}>
                        {skill}
                      </Text>
                    )
                  ))}
                </View>
              </View>
            )}

            {data.languages && data.languages.length > 0 && data.languages.some((lang: { language: string; proficiency: string }) => lang.language.trim() !== '') && (
              <View style={styles.languageSection}>
                <Text style={styles.sectionTitle}>Languages</Text>
                {data.languages.map((lang: any, index: number) => (
                  <View key={index}>
                    <Text style={styles.languageItem}>{lang.language}</Text>
                    <Text style={styles.languageLevel}>{lang.proficiency}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.section}>
              <Text style={styles.header}>{data.personalInfo.fullName}</Text>
              <Text style={styles.subHeader}>{data.personalInfo.title || 'Professional Title'}</Text>
              <View style={styles.contactInfo}>
                <View style={styles.contactItem}>
                  <Text>{data.personalInfo.email}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Text>{data.personalInfo.location}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Text>{data.personalInfo.phone}</Text>
                </View>
              </View>
            </View>

            {data.experience && data.experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.rightSectionTitle}>Work Experience</Text>
                {data.experience.map((exp: any, index: number) => (
                  <View key={index} style={styles.experienceItem}>
                    <Text style={styles.jobTitle}>{exp.title}</Text>
                    <Text style={styles.jobSubTitle}>{exp.company}</Text>
                    <View style={styles.jobDetails}>
                      <Text style={styles.dateRange}>{exp.startDate} - {exp.endDate || 'Present'}</Text>
                      <Text style={styles.jobLocation}>{exp.location}</Text>
                    </View>
                    <View style={styles.achievementContainer}>
                      {exp.description.split('\n').map((bullet: string, i: number) => (
                        <View key={i}>{renderBulletPoint(bullet)}</View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {data.education && data.education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.rightSectionTitle}>Education</Text>
                {data.education.map((edu: any, index: number) => (
                  <View key={index} style={styles.experienceItem}>
                    <Text style={styles.jobTitle}>{edu.school}</Text>
                    <Text style={styles.jobSubTitle}>{edu.degree}</Text>
                    <View style={styles.jobDetails}>
                      <Text style={styles.dateRange}>{edu.graduationDate}</Text>
                      <Text style={styles.jobLocation}>{edu.location}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Page>
      </Document>
    )
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>{data.personalInfo.fullName}</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>
            <Text style={styles.contactItem}>{data.personalInfo.email}</Text>
            <Text style={styles.contactItem}>{data.personalInfo.location}</Text>
          </View>
        </View>

        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu: any, index: number) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.school}>
                  <Text style={styles.jobTitle}>{edu.school}</Text>
                  <Text>{edu.graduationDate}</Text>
                </View>
                <View style={styles.jobDetails}>
                  <Text style={styles.degree}>{edu.degree}</Text>
                  <Text style={styles.jobLocation}>{edu.location}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {data.experience && data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((exp: any, index: number) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.jobDetails}>
                  <Text style={styles.jobTitle}>{exp.company}</Text>
                  <Text>{exp.startDate} - {exp.endDate || 'Present'}</Text>
                </View>
                <View style={styles.jobDetails}>
                  <Text style={styles.jobTitle}>{exp.title}</Text>
                  <Text style={styles.jobLocation}>{exp.location}</Text>
                </View>
                {exp.description.split('\n').map((bullet: string, i: number) => (
                  <View key={i}>{renderBulletPoint(bullet)}</View>
                ))}
              </View>
            ))}
          </View>
        )}

        {data.skills && data.skills.length > 0 && data.skills.some((skill: string) => skill.trim() !== '') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <View style={styles.skillsSection}>
              {data.skills.map((skill: string, index: number) => (
                skill.trim() !== '' && (
                  <Text key={index} style={styles.skillList}>
                    {skill}
                  </Text>
                )
              ))}
            </View>
          </View>
        )}

        {data.languages && data.languages.length > 0 && data.languages.some((lang: { language: string; proficiency: string }) => lang.language.trim() !== '') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Language Skills</Text>
            {data.languages.map((lang: any, index: number) => (
              <View key={index} style={styles.languageSection}>
                <Text style={styles.languageItem}>{lang.language}</Text>
                <Text style={styles.languageLevel}>{lang.proficiency}</Text>
              </View>
            ))}
          </View>
        )}

        {data.customSections && data.customSections.length > 0 && (
          <View style={styles.section}>
            {data.customSections.map((section: { title: string; description: string }, index: number) => (
              <View key={index} style={styles.customSection}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionDescription}>{section.description}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}

export const PDFPreview = ({ data, template }: { data: any, template?: string }) => (
  <PDFViewer style={{ width: '100%', height: '100vh' }}>
    <ResumeDocument data={data} template={template} />
  </PDFViewer>
) 