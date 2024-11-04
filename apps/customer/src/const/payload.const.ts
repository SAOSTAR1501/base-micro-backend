export const payloadResgiterNoti = ({ _id, fullName, username }: { _id: string, fullName: string, username: string }) => {
    const payloadNoti = {
        userId: _id,
        title: {
            vi: "📢 Chào mừng bạn đến với BioGo",
            en: "📢 Welcome to BioGo"
        },
        content: {
            vi: `Xin chào 👋 ${fullName}! Bạn đã đăng ký tài khoản BioGo thành công. Hãy khám phá và trải nghiệm các dịch vụ của chúng tôi ngay!`,
            en: `Hello 👋 ${fullName}! You have successfully registered for a BioGo account. Start exploring and enjoying our services!`
        },
        metadata: {
            link: `/profile/${username}`
        },
        type: "REGISTER"
    };
    return payloadNoti
}