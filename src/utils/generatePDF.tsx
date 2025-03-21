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

// Update the ExperienceItem interface
interface ExperienceItem {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string[] | string;
  bulletPoints?: string[];
}

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
    fontWeight?: number | string;
  };
  contactInfo?: {
    flexDirection?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
    marginBottom?: number;
    fontSize?: number;
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    gap?: number;
    borderBottom?: number;
    borderBottomColor?: string;
    borderBottomStyle?: 'solid' | 'dashed' | 'dotted';
    paddingBottom?: number;
  };
  contactItem?: {
    marginHorizontal?: number;
    fontSize?: number;
    marginBottom?: number;
    color?: string;
    flexDirection?: 'row' | 'column';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    gap?: number;
    marginRight?: number;
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
    fontWeight?: number | string;
    borderBottom?: number;
  };
  experienceItem: {
    marginBottom: number;
  };
  educationItem: {
    marginBottom: number;
  };
  jobTitle: {
    fontSize: number;
    fontFamily?: string;
    color?: string;
    marginBottom?: number;
    fontWeight?: number | string;
    fontStyle?: 'normal' | 'italic' | 'oblique';
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
    fontStyle?: 'normal' | 'italic' | 'oblique';
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
    marginTop?: number;
  };
  skillsContainer: {
    flexDirection: 'row' | 'column';
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    gap?: number;
  };
  skillsSection?: {
    marginTop?: number;
    flexDirection?: 'row' | 'column';
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    gap?: number;
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
    width?: string;
  };
  degree?: {
    fontSize: number;
    fontFamily?: string;
    color?: string;
    fontWeight?: number | string;
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
    fontWeight?: number | string;
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
    fontWeight?: number | string;
  };
  jobSubTitle?: {
    fontSize: number;
    color?: string;
    marginBottom?: number;
    fontStyle?: 'normal' | 'italic' | 'oblique';
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
  rightSectionExperience: {
    marginBottom: number;
  };
  rightSectionEducation: {
    marginBottom: number;
  };
  rightSectionCustom: {
    marginBottom: number;
  };
  companyName: {
    fontSize: number;
    marginBottom: number;
  };
  educationInstitution: {
    fontSize: number;
    fontWeight: string;
  };
  educationDegree: {
    fontSize: number;
  };
  educationDate: {
    fontSize: number;
    fontStyle: 'normal' | 'italic';
  };
  customItemTitle: {
    fontSize: number;
    fontWeight: string;
  };
  customItemSubtitle: {
    fontSize: number;
    marginBottom: number;
  };
}

const professionalStyles: StyleDefinitions = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: '30 40',
    fontFamily: 'Noto Sans',
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 6,
    fontFamily: 'Noto Sans',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    fontSize: 8,
    flexWrap: 'wrap',
    gap: 10,
    borderBottom: 1,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid',
    paddingBottom: 6,
  },
  contactItem: {
    marginHorizontal: 5,
    fontSize: 8,
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 6,
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
  educationItem: {
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 10,
    fontFamily: 'Noto Sans',
    fontWeight: 'bold',
    marginBottom: 1,
  },
  jobDetails: {
    fontSize: 8,
    marginBottom: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobLocation: {
    fontSize: 8,
    fontFamily: 'Noto Sans',
    fontStyle: 'italic',
  },
  jobDescription: {
    fontSize: 8,
    lineHeight: 1.3,
    marginLeft: 4,
  },
  bulletPoint: {
    width: 2,
    fontSize: 8,
    marginRight: 4,
    color: '#333',
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
    marginTop: 1,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  skillsSection: {
    marginTop: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillList: {
    fontSize: 8,
    width: '32%',
    marginBottom: 3,
  },
  degree: {
    fontSize: 9,
    fontFamily: 'Noto Sans',
    fontWeight: 'normal',
  },
  school: {
    fontSize: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coursework: {
    fontSize: 8,
    marginTop: 2,
  },
  courseworkTitle: {
    fontSize: 8,
    fontFamily: 'Noto Sans',
    fontWeight: 700,
    marginBottom: 1,
  },
  courseworkList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  courseworkItem: {
    fontSize: 8,
  },
  languageSection: {
    marginTop: 3,
    marginBottom: 3,
  },
  languageItem: {
    fontSize: 8,
    marginBottom: 1,
  },
  languageLevel: {
    fontSize: 8,
    fontStyle: 'italic',
    color: '#666',
  },
  customSection: {
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 8,
    marginLeft: 5,
  },
  jobSubTitle: {
    fontSize: 9,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  rightSectionExperience: {
    marginBottom: 15,
  },
  rightSectionEducation: {
    marginBottom: 15,
  },
  rightSectionCustom: {
    marginBottom: 15,
  },
  companyName: {
    fontSize: 8,
    marginBottom: 3,
  },
  educationInstitution: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  educationDegree: {
    fontSize: 8,
  },
  educationDate: {
    fontSize: 7,
    fontStyle: 'italic' as const,
  },
  customItemTitle: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  customItemSubtitle: {
    fontSize: 8,
    marginBottom: 3,
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
    width: '26%',
    backgroundColor: '#2D3748',
    padding: 12,
    color: '#fff',
  },
  rightColumn: {
    width: '74%',
    padding: 16,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 3,
    color: '#000',
    fontFamily: 'Open Sans',
    fontWeight: 700,
  },
  subHeader: {
    fontSize: 10,
    color: '#718096',
    marginBottom: 8,
  },
  contactInfo: {
    marginBottom: 10,
  },
  contactItem: {
    fontSize: 8,
    marginBottom: 4,
    color: '#718096',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  sectionTitle: {
    fontSize: 10,
    marginBottom: 8,
    color: '#fff',
    fontFamily: 'Open Sans',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  rightSectionTitle: {
    fontSize: 12,
    marginBottom: 8,
    color: '#2D3748',
    fontFamily: 'Open Sans',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  experienceItem: {
    marginBottom: 8,
  },
  educationItem: {
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 10,
    color: '#2D3748',
    fontFamily: 'Open Sans',
    fontWeight: 700,
    marginBottom: 2,
  },
  jobSubTitle: {
    fontSize: 9,
    color: '#718096',
    marginBottom: 3,
  },
  jobDetails: {
    fontSize: 8,
    color: '#4A5568',
    marginBottom: 3,
  },
  jobLocation: {
    fontSize: 8,
    color: '#718096',
  },
  jobDescription: {
    fontSize: 8,
    lineHeight: 1.3,
    color: '#4A5568',
    marginLeft: 4,
  },
  bulletPoint: {
    width: 2,
    fontSize: 8,
    marginRight: 4,
    color: '#4A5568',
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
    marginTop: 0,
  },
  skillsSection: {
    marginTop: 0,
  },
  skillCategory: {
    fontSize: 9,
    color: '#fff',
    marginBottom: 4,
  },
  skillList: {
    fontSize: 8,
    color: '#fff',
    backgroundColor: '#4A5568',
    padding: '2 4',
    marginBottom: 3,
    borderRadius: 2,
  },
  skillsContainer: {
    flexDirection: 'column',
  },
  languageSection: {
    marginTop: 6,
    marginBottom: 6,
  },
  languageItem: {
    fontSize: 8,
    color: '#fff',
    marginBottom: 2,
  },
  languageLevel: {
    fontSize: 7,
    color: '#A0AEC0',
    fontStyle: 'italic',
  },
  achievementContainer: {
    marginTop: 4,
  },
  dateRange: {
    fontSize: 8,
    color: '#718096',
    marginBottom: 2,
  },
}) as StyleDefinitions;

const minimalStyles: StyleDefinitions = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
    fontFamily: 'Open Sans',
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 5,
    color: '#000',
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 10,
    marginBottom: 3,
    color: '#666',
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
    fontSize: 8,
    flexWrap: 'wrap',
    gap: 10,
    borderBottom: 0.5,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid',
    paddingBottom: 6,
  },
  contactItem: {
    marginRight: 8,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 6,
    color: '#000',
    fontFamily: 'Open Sans',
    fontWeight: 700,
    borderBottom: 0.5,
    borderBottomColor: '#ccc',
    paddingBottom: 2,
  },
  experienceItem: {
    marginBottom: 8,
  },
  educationItem: {
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 1,
  },
  jobSubTitle: {
    fontSize: 9,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  jobDetails: {
    fontSize: 8,
    marginBottom: 3,
    color: '#666',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobLocation: {
    fontSize: 8,
    color: '#666',
  },
  jobDescription: {
    fontSize: 8,
    lineHeight: 1.3,
    color: '#333',
    marginLeft: 4,
  },
  bulletPoint: {
    width: 2,
    fontSize: 8,
    marginRight: 4,
    color: '#333',
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
    marginTop: 0,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillsSection: {
    marginTop: 2,
  },
  skillList: {
    fontSize: 8,
    color: '#333',
  },
  degree: {
    fontSize: 9,
    fontWeight: 'normal',
    color: '#000',
  },
  school: {
    fontSize: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageSection: {
    marginTop: 6,
    marginBottom: 6,
  },
  languageItem: {
    fontSize: 8,
    color: '#333',
    marginBottom: 1,
  },
  languageLevel: {
    fontSize: 7,
    fontStyle: 'italic',
    color: '#666',
  },
}) as StyleDefinitions;

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

  // Calculate content density to adjust spacing
  const calculateContentDensity = () => {
    let contentCount = 0;
    
    // Count experience items and their bullet points
    if (data.experience) {
      contentCount += data.experience.length;
      data.experience.forEach((exp: any) => {
        if (exp.bulletPoints && exp.bulletPoints.length) {
          contentCount += exp.bulletPoints.length * 0.5;
        } else if (exp.description) {
          contentCount += exp.description.split('\n').length * 0.5;
        }
      });
    }
    
    // Count education items
    if (data.education) {
      contentCount += data.education.length;
    }
    
    // Count skills
    if (data.skills) {
      contentCount += Math.ceil(data.skills.length * 0.3);
    }
    
    // Count languages
    if (data.languages) {
      contentCount += data.languages.length * 0.5;
    }
    
    // Count custom sections
    if (data.customSections) {
      contentCount += data.customSections.length * 2;
    }
    
    return contentCount;
  };

  const contentDensity = calculateContentDensity();
  
  // Adjust spacing based on content density
  const getAdaptiveSpacing = () => {
    // Base spacing adjustments
    let sectionSpacing = 10;
    let itemSpacing = 8;
    let bulletSpacing = 2;
    let verticalDistribution = 1.0; // Default distribution factor
    
    // Calculate page coverage based on sections present
    const hasSkills = data.skills && data.skills.length > 0;
    const hasLanguages = data.languages && data.languages.length > 0;
    const hasExperience = data.experience && data.experience.length > 0;
    const hasEducation = data.education && data.education.length > 0;
    const hasCustomSections = data.customSections && data.customSections.length > 0;
    
    // Count total sections
    const sectionCount = [hasSkills, hasLanguages, hasExperience, hasEducation, hasCustomSections].filter(Boolean).length;
    
    if (contentDensity < 10) {
      // Low content density - increase spacing but not too much
      sectionSpacing = 14;
      itemSpacing = 10;
      bulletSpacing = 2.5;
      verticalDistribution = 1.2;
    } else if (contentDensity < 15) {
      // Medium-low content density
      sectionSpacing = 12;
      itemSpacing = 9;
      bulletSpacing = 2.5;
      verticalDistribution = 1.1;
    } else if (contentDensity > 20) {
      // High content density - decrease spacing
      sectionSpacing = 8;
      itemSpacing = 6;
      bulletSpacing = 1;
      verticalDistribution = 0.9;
    }
    
    // If no custom sections, increase distribution factor to fill page
    if (!hasCustomSections) {
      verticalDistribution *= 1.1;
      sectionSpacing = Math.round(sectionSpacing * 1.2);
      
      // If fewer than 4 total sections, increase spacing moderately
      if (sectionCount < 4) {
        verticalDistribution *= 1.1;
        sectionSpacing = Math.round(sectionSpacing * 1.1);
        itemSpacing = Math.round(itemSpacing * 1.1);
      }
    }
    
    // Adjust line height for descriptions
    const lineHeightAdjustment = contentDensity > 20 ? 1.2 : 
                                 contentDensity < 10 ? 1.5 : 
                                 1.4;
    
    // Add line height for bullet points
    const lineHeight = contentDensity > 20 ? 0 : 
                       contentDensity < 10 ? 0.2 : 
                       0.1;
    
    return {
      sectionSpacing,
      itemSpacing,
      bulletSpacing,
      // Calculate font size adjustments
      fontSize: contentDensity > 20 ? -1 : contentDensity < 10 ? 0.5 : 0,
      verticalDistribution,
      lineHeightAdjustment,
      lineHeight
    };
  };
  
  const adaptiveSpacing = getAdaptiveSpacing();

  const renderBulletPoint = (text: string, index: number, spacing?: any) => {
    const adaptiveSpacing = spacing || { bulletSpacing: 3, verticalDistribution: 1, lineHeight: 0 };
    return (
      <View key={index} style={{ flexDirection: 'row', marginBottom: adaptiveSpacing.bulletSpacing * adaptiveSpacing.verticalDistribution * 0.9 }}>
        <Text style={{ ...styles.bulletPoint, lineHeight: 1.3 + adaptiveSpacing.lineHeight }}>•</Text>
        <Text style={{ ...styles.jobDescription, lineHeight: 1.3 + adaptiveSpacing.lineHeight }}>{text}</Text>
      </View>
    );
  };

  if (template === 'creative') {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.leftColumn}>
            {data.skills && data.skills.length > 0 && data.skills.some((skill: string) => skill.trim() !== '') && (
              <View style={{
                ...styles.section, 
                marginBottom: adaptiveSpacing.sectionSpacing * adaptiveSpacing.verticalDistribution
              }}>
                <Text style={{
                  ...styles.sectionTitle,
                  marginBottom: adaptiveSpacing.bulletSpacing * 4 * adaptiveSpacing.verticalDistribution
                }}>Skills</Text>
                <View style={styles.skillsContainer}>
                  {data.skills.map((skill: string, index: number) => (
                    skill.trim() !== '' && (
                      <Text key={index} style={{
                        ...styles.skillList,
                        marginBottom: 3 * adaptiveSpacing.verticalDistribution
                      }}>
                        {skill}
                      </Text>
                    )
                  ))}
                </View>
              </View>
            )}

            {data.languages && data.languages.length > 0 && data.languages.some((lang: { language: string; proficiency: string }) => lang.language.trim() !== '') && (
              <View style={{
                ...styles.languageSection, 
                marginBottom: adaptiveSpacing.sectionSpacing * adaptiveSpacing.verticalDistribution
              }}>
                <Text style={{
                  ...styles.sectionTitle,
                  marginBottom: adaptiveSpacing.bulletSpacing * 4 * adaptiveSpacing.verticalDistribution
                }}>Languages</Text>
                {data.languages.map((lang: any, index: number) => (
                  <View key={index} style={{
                    marginBottom: 3 * adaptiveSpacing.verticalDistribution
                  }}>
                    <Text style={styles.languageItem}>{lang.language}</Text>
                    <Text style={styles.languageLevel}>{lang.proficiency}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.rightColumn}>
            <View style={{
              ...styles.section, 
              marginBottom: adaptiveSpacing.sectionSpacing * adaptiveSpacing.verticalDistribution * 1.2
            }}>
              <Text style={{
                ...styles.header,
                marginBottom: 6 * adaptiveSpacing.verticalDistribution
              }}>{data.personalInfo.fullName}</Text>
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

            {data.experience && data.experience.length > 0 && data.experience.some((exp: any) => exp.title.trim() !== '' || exp.company.trim() !== '') && (
              <View style={{
                ...styles.rightSectionExperience,
                marginBottom: adaptiveSpacing.sectionSpacing * adaptiveSpacing.verticalDistribution
              }}>
                <Text style={{
                  ...styles.sectionTitle, 
                  marginBottom: adaptiveSpacing.itemSpacing * adaptiveSpacing.verticalDistribution
                }}>Experience</Text>
                {data.experience.map((experience: ExperienceItem, index: number) => (
                  (experience.title.trim() !== '' || experience.company.trim() !== '') && (
                    <View key={index} style={{
                      marginBottom: adaptiveSpacing.itemSpacing * adaptiveSpacing.verticalDistribution
                    }}>
                      <Text style={styles.jobTitle}>{experience.title}</Text>
                      <Text style={styles.companyName}>{experience.company} | {experience.startDate} - {experience.endDate}</Text>
                      {typeof experience.description === 'string' ? 
                        experience.description.split('\n').map((bulletPoint: string, bpIndex: number) => 
                          renderBulletPoint(bulletPoint, bpIndex, adaptiveSpacing)
                        ) :
                        experience.description.map((bulletPoint: string, bpIndex: number) => 
                          renderBulletPoint(bulletPoint, bpIndex, adaptiveSpacing)
                        )
                      }
                    </View>
                  )
                ))}
              </View>
            )}

            {data.education && data.education.length > 0 && data.education.some((edu: any) => edu.institution.trim() !== '' || edu.degree.trim() !== '') && (
              <View style={{
                ...styles.rightSectionEducation,
                marginBottom: adaptiveSpacing.sectionSpacing * adaptiveSpacing.verticalDistribution
              }}>
                <Text style={{
                  ...styles.sectionTitle,
                  marginBottom: adaptiveSpacing.itemSpacing * adaptiveSpacing.verticalDistribution
                }}>Education</Text>
                {data.education.map((education: any, index: number) => (
                  (education.institution.trim() !== '' || education.degree.trim() !== '') && (
                    <View key={index} style={{
                      marginBottom: adaptiveSpacing.itemSpacing * adaptiveSpacing.verticalDistribution * 0.8
                    }}>
                      <Text style={styles.educationInstitution}>{education.institution}</Text>
                      <Text style={styles.educationDegree}>{education.degree}</Text>
                      <Text style={styles.educationDate}>{education.startDate} - {education.endDate}</Text>
                    </View>
                  )
                ))}
              </View>
            )}

            {data.customSections && data.customSections.length > 0 && data.customSections.map((section: any, sectionIndex: number) => (
              section.items && section.items.length > 0 && section.items.some((item: any) => 
                item.title.trim() !== '' || item.subtitle.trim() !== '' || 
                (item.description && item.description.some((desc: string) => desc.trim() !== ''))
              ) && (
                <View key={sectionIndex} style={{
                  ...styles.rightSectionCustom,
                  marginBottom: adaptiveSpacing.sectionSpacing * adaptiveSpacing.verticalDistribution
                }}>
                  <Text style={{
                    ...styles.sectionTitle,
                    marginBottom: adaptiveSpacing.itemSpacing * adaptiveSpacing.verticalDistribution
                  }}>{section.title}</Text>
                  {section.items.map((item: any, itemIndex: number) => (
                    (item.title.trim() !== '' || item.subtitle.trim() !== '' || 
                    (item.description && item.description.some((desc: string) => desc.trim() !== ''))) && (
                      <View key={itemIndex} style={{
                        marginBottom: adaptiveSpacing.itemSpacing * adaptiveSpacing.verticalDistribution * 0.8
                      }}>
                        <Text style={styles.customItemTitle}>{item.title}</Text>
                        <Text style={styles.customItemSubtitle}>{item.subtitle} | {item.startDate} - {item.endDate}</Text>
                        {item.description && item.description.map((bulletPoint: string, bpIndex: number) => 
                          renderBulletPoint(bulletPoint, bpIndex, adaptiveSpacing)
                        )}
                      </View>
                    )
                  ))}
                </View>
              )
            ))}
          </View>
        </Page>
      </Document>
    )
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{
          ...styles.section, 
          marginBottom: adaptiveSpacing.sectionSpacing * adaptiveSpacing.verticalDistribution * 1.2
        }}>
          <Text style={{
            ...styles.header,
            marginBottom: 6 * adaptiveSpacing.verticalDistribution
          }}>{data.personalInfo.fullName}</Text>
          <View style={{
            ...styles.contactInfo,
            marginBottom: 5 * adaptiveSpacing.verticalDistribution,
            paddingBottom: 6 * adaptiveSpacing.verticalDistribution
          }}>
            <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>
            <Text style={styles.contactItem}>{data.personalInfo.email}</Text>
            <Text style={styles.contactItem}>{data.personalInfo.location}</Text>
          </View>
        </View>

        {data.education && data.education.length > 0 && (
          <View style={{
            ...styles.section, 
            marginBottom: adaptiveSpacing.sectionSpacing * adaptiveSpacing.verticalDistribution
          }}>
            <Text style={{
              ...styles.sectionTitle,
              marginBottom: adaptiveSpacing.bulletSpacing * 4 * adaptiveSpacing.verticalDistribution
            }}>Education</Text>
            {data.education.map((edu: any, index: number) => (
              <View key={index} style={{
                ...styles.educationItem, 
                marginBottom: adaptiveSpacing.itemSpacing * adaptiveSpacing.verticalDistribution
              }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={{...styles.jobTitle, fontWeight: 'normal', fontSize: 9 + adaptiveSpacing.fontSize}}>{edu.school}</Text>
                  <Text style={{fontSize: 8 + adaptiveSpacing.fontSize}}>{edu.graduationDate}</Text>
                </View>
                <View style={{marginTop: 1}}>
                  <Text style={{fontSize: 8 + adaptiveSpacing.fontSize}}>{edu.degree}</Text>
                  <Text style={{...styles.jobLocation, fontSize: 7 + adaptiveSpacing.fontSize}}>{edu.location}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {data.experience && data.experience.length > 0 && (
          <View style={{
            ...styles.section, 
            marginBottom: adaptiveSpacing.sectionSpacing * adaptiveSpacing.verticalDistribution
          }}>
            <Text style={{
              ...styles.sectionTitle,
              marginBottom: adaptiveSpacing.bulletSpacing * 4 * adaptiveSpacing.verticalDistribution
            }}>Experience</Text>
            {data.experience.map((exp: any, index: number) => (
              <View key={index} style={{
                ...styles.experienceItem, 
                marginBottom: adaptiveSpacing.itemSpacing * adaptiveSpacing.verticalDistribution
              }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1}}>
                  <Text style={{...styles.jobTitle, fontSize: 10 + adaptiveSpacing.fontSize}}>{exp.title}</Text>
                  <Text style={{fontSize: 8 + adaptiveSpacing.fontSize}}>{exp.startDate} - {exp.endDate || 'Present'}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1}}>
                  <Text style={{...styles.jobSubTitle, fontSize: 9 + adaptiveSpacing.fontSize}}>{exp.company}</Text>
                  <Text style={{fontSize: 7 + adaptiveSpacing.fontSize, fontStyle: 'italic'}}>{exp.location}</Text>
                </View>
                {exp.bulletPoints && exp.bulletPoints.length > 0 ? (
                  exp.bulletPoints.map((bullet: string, i: number) => (
                    bullet.trim() !== '' && (
                      <View key={i} style={{
                        ...styles.bulletContainer, 
                        marginBottom: adaptiveSpacing.bulletSpacing * adaptiveSpacing.verticalDistribution * 0.9
                      }}>
                        <Text style={{...styles.bulletPoint, fontSize: 8 + adaptiveSpacing.fontSize}}>•</Text>
                        <Text style={{
                          ...styles.jobDescription, 
                          fontSize: 8 + adaptiveSpacing.fontSize,
                          lineHeight: 1.3 + adaptiveSpacing.lineHeight
                        }}>{bullet}</Text>
                      </View>
                    )
                  ))
                ) : (
                  exp.description.split('\n').map((bullet: string, i: number) => (
                    <View key={i} style={{
                      ...styles.bulletContainer, 
                      marginBottom: adaptiveSpacing.bulletSpacing * adaptiveSpacing.verticalDistribution * 0.9
                    }}>
                      <Text style={{...styles.bulletPoint, fontSize: 8 + adaptiveSpacing.fontSize}}>•</Text>
                      <Text style={{
                        ...styles.jobDescription, 
                        fontSize: 8 + adaptiveSpacing.fontSize,
                        lineHeight: 1.3 + adaptiveSpacing.lineHeight
                      }}>{bullet}</Text>
                    </View>
                  ))
                )}
              </View>
            ))}
          </View>
        )}

        {data.skills && data.skills.length > 0 && data.skills.some((skill: string) => skill.trim() !== '') && (
          <View style={{
            ...styles.section, 
            marginBottom: adaptiveSpacing.sectionSpacing * adaptiveSpacing.verticalDistribution
          }}>
            <Text style={{
              ...styles.sectionTitle,
              marginBottom: adaptiveSpacing.bulletSpacing * 4 * adaptiveSpacing.verticalDistribution
            }}>Technical Skills</Text>
            <View style={{...styles.skillsSection, flexDirection: 'row', flexWrap: 'wrap'}}>
              {data.skills.map((skill: string, index: number) => (
                skill.trim() !== '' && (
                  <Text key={index} style={{
                    ...styles.skillList, 
                    width: contentDensity < 10 ? '30%' : contentDensity > 20 ? '24%' : '30%', 
                    marginRight: '3%', 
                    marginBottom: 2,
                    fontSize: 8 + adaptiveSpacing.fontSize
                  }}>
                    {skill}
                  </Text>
                )
              ))}
            </View>
          </View>
        )}

        {data.languages && data.languages.length > 0 && data.languages.some((lang: { language: string; proficiency: string }) => lang.language.trim() !== '') && (
          <View style={{
            ...styles.section, 
            marginBottom: adaptiveSpacing.sectionSpacing * adaptiveSpacing.verticalDistribution
          }}>
            <Text style={{
              ...styles.sectionTitle,
              marginBottom: adaptiveSpacing.bulletSpacing * 4 * adaptiveSpacing.verticalDistribution
            }}>Language Skills</Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {data.languages.map((lang: any, index: number) => (
                <View key={index} style={{
                  width: contentDensity < 10 ? '30%' : contentDensity > 20 ? '24%' : '30%',
                  marginRight: '3%', 
                  marginBottom: adaptiveSpacing.bulletSpacing
                }}>
                  <Text style={{...styles.languageItem, marginBottom: 0, fontSize: 8 + adaptiveSpacing.fontSize}}>{lang.language}</Text>
                  <Text style={{...styles.languageLevel, fontSize: 7 + adaptiveSpacing.fontSize}}>{lang.proficiency}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {data.customSections && data.customSections.length > 0 && (
          <View style={{
            ...styles.section, 
            marginBottom: adaptiveSpacing.sectionSpacing * adaptiveSpacing.verticalDistribution
          }}>
            {data.customSections.map((section: { title: string; description: string }, index: number) => (
              <View key={index} style={{...styles.customSection, marginBottom: adaptiveSpacing.sectionSpacing}}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={{...styles.sectionDescription, fontSize: 8 + adaptiveSpacing.fontSize}}>{section.description}</Text>
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