export default {
  // Custom admin config for Card collection
  config: {
    attributes: {
      // Conditional field visibility based on Enumeration
      titleLine1: {
        visible: (data) => data.Enumeration === 'Block_BigText'
      },
      titleLine2: {
        visible: (data) => data.Enumeration === 'Block_BigText'
      },
      titleColor: {
        visible: (data) => data.Enumeration === 'Block_BigText'
      },
      imageSrc: {
        visible: (data) => data.Enumeration === 'Block_Image'
      },
      imageAlt: {
        visible: (data) => data.Enumeration === 'Block_Image'
      },
      videoWebm: {
        visible: (data) => data.Enumeration === 'Block_Video'
      },
      videoMp4: {
        visible: (data) => data.Enumeration === 'Block_Video'
      },
      title: {
        visible: (data) => ['Block_DescText', 'Block_Video', 'Block_Image'].includes(data.Enumeration)
      },
      description: {
        visible: (data) => ['Block_DescText', 'Block_Video', 'Block_Image'].includes(data.Enumeration)
      },
      category: {
        visible: (data) => ['Block_Video', 'Block_Image'].includes(data.Enumeration)
      }
    }
  }
};