interface Avatar {
    url: string;
    publicId?: string;
}

interface IntroductionVideo {
    url: string;
    publicId?: string;
}

interface SocialMedia {
    platform: string;
    description: string;
    link: string;
}  

interface Infor {
    title: string;
    content: string;
}

interface ImageInfo {
    index: number;
    description: string;
    url: string;
    clickLink: string;
}

interface MediaWidget {
    index: number;
    type: string;
    title: string;
    imageInfos: ImageInfo[];
}

interface Tab {
    index: number;
    title: string;
    content: string;
}

export interface IUpdateBio {
    fullName?: string;
    avatar?: Avatar;
    jobId?: string;
    jobTitle?: string;
    description?: string;
    socialMedias?: SocialMedia[];
    infors?: Infor[];
    tags?: string[];
    instructionVideo?: IntroductionVideo;
    mediaWidgets?: MediaWidget[];
    tabs?: Tab[];
}
