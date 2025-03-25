import { SponsorshipPlan, User } from "@/prisma/generated";
import { SessionMetadata } from "@/src/shared/types/session-metadata.types";

export const MESSAGES = {

    welcome:
        `<b>🖐️ Chào mừng bạn đến với TanStream Bot! </b> \n\n` +
        `Để nhận thông báo và cải thiện trải nghiệm người dùng sử dụng nền tảng, Hãy liên kết tài khoản Telegram của bạn với TanStream.\n\n` +
        `Hãy nhấp vào nút bên dưới và đi đến phần <b>Thông báo </b> đẻ hoàn tất thiết lập.`,
    authSuccess: `🎉 Bạn đã đăng nhập thành công và tài khoản Telegram đã được liên kết với TanStream! \n\n`,
    invalidToken: `❌ Mã token không hợp lệ hoặc đã hết hạn!`,
    profile: (user: User, followersCount: number) =>
        `<b>Hồ sơ người dùng: </b> \n\n` +
        `👤Tên người dùng: <b>${user.username}</b>\n\n` +
        `📧Email: <b>${user.email}</b>\n\n` +
        `👤Số lượng người đăng ký: <b>${followersCount}</b>\n\n` +
        `📝Giới thiệu bản thân: <b>${user.bio || 'Trống'}</b>\n\n` +
        `🛠️Nhấp vào nút bên dưới để cài đặt hồ sơ của bạn.`,
    follows: (user: User) =>
        `📺 <a href="https://tanstream.vn/${user.username}"> ${user.username}</a>`,
    resetPassword: (token: string, metadata: SessionMetadata) =>
        `🔒<b>Đặt lại mật khẩu</b>\n\n ` +
        `Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình trên <b>TanStream</b>\n\n` +
        `Để tạo mật khẩu mới vui lòng nhấp theo liên kết này: \n\n` +
        ` <b><a href="https://tanstream.vn/account/recovery/${token}"> Đặt lại mật khẩu</a></b>\n\n` +
        `📅<b>Ngày yêu cầu:</b> ${new Date().toLocaleDateString()} lúc ${new Date().toLocaleTimeString()} \n\n` +
        `🌏<b>Vị trí:</b> ${metadata.location.country}, ${metadata.location.city} \n\n` +
        `🖥️<b>Thông tin thiết bị:</b>\n\n` +
        `📱<b>Hệ điều hành:</b> ${metadata.device.os} \n\n` +
        `🌐 <b>Trình duyệt:</b> ${metadata.device.browser}\n\n` +
        `💻<b>Địa chỉ IP:</b> ${metadata.ip}\n\n` +
        `Nếu bạn không thực hiện yêu cầu, hãy bỏ qua thông tin này \n\n` +
        `Cảm ơn bạn đã sử dụng <b>TanStream</b> 🚀`,
    deactivate: (token: string, metadata: SessionMetadata) =>
        `⚠️<b>Yêu cầu kích hoạt vô hiệu hóa tài khoản</b>\n\n ` +
        `Bạn đã bắt đầu quá trình kích hoạt vô hiệu hóa tài khoản của mình trên nền tảng <b>TanStream</b>\n\n ` +
        `Để hoàn tất, vui lòng xác nhận yêu cầu của bạn bằng cách nhập mã xác nhận sau:\n\n ` +
        `Mã này có hiệu lực trong 5 phút\n\n ` +
        `<b>Mã xác nhận: ${token}</b>\n\n ` +
        `📅<b>Ngày yêu cầu:</b> ${new Date().toLocaleDateString()} lúc ${new Date().toLocaleTimeString()}   \n\n` +
        `🌏<b>Vị trí:</b> ${metadata.location.country}, ${metadata.location.city} \n\n` +
        `🖥️<b>Thông tin thiết bị:</b>\n\n` +
        `📱<b>Hệ điều hành:</b> ${metadata.device.os} \n\n` +
        `🌐 <b>Trình duyệt:</b> ${metadata.device.browser}\n\n` +
        `💻<b>Địa chỉ IP:</b> ${metadata.ip}\n\n` +
        `<b>Điều gì sẽ xảy ra khi bạn vô hiệu hóa tài khoản</b> \n\n` +
        `1. Bạn sẽ tự động đăng xuất và mất quyền truy cập vào tài khoản của mình. \n\n` +
        `2. Nếu bạn không hủy kích hoạt vô hiệu tài khoản của mình trong vòng 7 ngày, tài khoản của bạn sẽ bị xóa <b>vĩnh viễn</b> cùng với tất cả thông tin, dữ liệu và lượt đăng ký của bạn.\n\n` +
        `⏳ Xin lưu ý: Nếu bạn thay đổi quyết định trong vòng 7 ngày, bạn có thể liên hệ với bộ phận hỗ trợ của chúng tôi để  khôi phục quyền truy cập vào tài khoản của mình trước khi tài khoản bị xóa hoàn toàn. \n\n` +
        `Sau khi tài khoản của bạn bị xóa, bạn sẽ không thể khôi phục lại được và mọi dữ liệu sẽ biến mất mà không thể khôi phục được.\n\n` +
        `Nếu bạn đổi ý, chỉ cần bỏ qua tin nhắn này, tài khoản của bạn vẫn sẽ hoạt động bình thường.\n\n` +
        `Cảm ơn bạn đã sử dụng <b>TanStream</b> 🚀, chúng tôi luôn vui mừng khi thấy bạn trên nền tảng của chúng tôi và hy vọng bạn sẽ cùng đồng hành cùng chúng tôi!\n\n` +
        `Trân trọng, \n\n` +
        `Đội ngũ TanStream`,
    accountDeleted:
        `⚠️<b>Tài khoản của bạn đã bị xóa hoàn toàn</b>\n\n ` +
        `Tài khoản của bạn đã bị xóa hoàn toàn khỏi cơ sở dữ liệu của TanStream. Mọi dữ liệu và thông tin của bạn đã bị xóa vĩnh viễn ❌\n\n ` +
        `🔒Bạn sẽ không còn nhận được thông báo trên Telegram và qua Email\n\n ` +
        `Nếu bạn muốn quay lại nền tảng, bạn có thể đăng ký bằng liên kết sau:\n\n ` +
        `<b><a href="https://tanstream.vn/account/create">Đăng ký trên TanStream</a></b>\n\n ` +
        `Cảm ơn bạn đã ở bên chúng tôi! Chúng tôi sẽ luôn vui mừng khi thấy bạn trên nền tảng \n\n ` +
        `Trân trọng, \n\n` +
        `Đội ngũ TanStream`,
    streamStart: (channel: User) =>
        `<b>Chương tình phát sóng đã bắt đầu trên kênh ${channel.displayName}</b> \n\n` +
        `Xem tại đây: <a href="https://tanstream.vn/${channel.username}">Đi đến phát sóng</a>  \n\n`,
    newFollowing: (follower: User, followerCount: number) =>
        `<b>Có người đăng ký mới!</b>\n\n Đây là người dùng <a href="https://tanstream.vn/${follower.username}">${follower.displayName}</a> \n\n
    Số người đăng ký hiện tại của bạn là: ${followerCount}`,
    newSponsorship: (plan: SponsorshipPlan, sponsor: User) =>
        `<b>🎉 Có người đăng ký hội viên mới </b>\n\n` +
        `Bạn đã có thêm 1 người đăng ký gói hội viên <b>${plan.title}</b>\n\n` +
        `💰 Giá gói: <b>${plan.price} $</b>\n\n` +
        `👤Người dùng: <a href="https://tanstream.vn/${sponsor.username}">${sponsor.displayName}</a> \n\n` +
        `📅<b>Thời gian đăng ký hội viên:</b> ${new Date().toLocaleDateString()} lúc ${new Date().toLocaleTimeString()}   \n\n` +
        `Trân trọng, \n\n` +
        `Đội ngũ TanStream`,
    enableTwoFactor:
        `🔒Đảm bảo an toàn cho bạn! \n\n` +
        `Bật xác thực 2 yếu tố trong <a href="https://tanstream.vn/dashboard/settings">Cài đặt tài khoản </a> `,
    verifyChannel:
        `🎉<b> Xin chúc mừng ! Kênh của bạn đã được huy hiệu tích xanh </b> \n\n` +
        `Chúng tôi xin thông báo rằng kênh của bạn đã được huy hiệu tích xanh và bạn đã có thể tạo gói hội viên riêng cho kênh của bạn \n\n` +
        `Huy hiệu này còn xác nhận tính xác thực của kênh của bạn và cải thiện độ tin cậy của người xem \n\n` +
        `Trân trọng, \n\n` +
        `Đội ngũ TanStream`,
}