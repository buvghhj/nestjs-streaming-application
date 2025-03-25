'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/common/Tabs"
import { Heading } from "@/components/ui/elements/Heading"
import { useTranslations } from "next-intl"
import ChangeAvatarForm from "./profile/ChangeAvatarForm"
import ChangeInfoForm from "./profile/ChangeInfoForm"
import SocialLinkForm from "./profile/socila-link-form/SocialLinkForm"
import ChangeEmailForm from "./account/ChangeEmailForm"
import ChangePasswordForm from "./account/ChangePasswordForm"
import WrapperTotp from "./account/totp/WrapperTotp"
import DeactivateCard from "./account/totp/DeactivateCard"
import ChangeThemeForm from "./apperance/ChangeThemeForm"
import ChangeLanguageForm from "./apperance/ChangeLanguageForm"
import ChangeColorForm from "./apperance/ChangeColorForm"
import ChangeNotificationForm from "./notification/ChangeNotificationForm"
import SessionList from "./sessions/SessionList"

const UserSettings = () => {

    const t = useTranslations('dashboard.settings')

    return (
        <>
            <div className="lg:px-10">

                <Heading title={t('header.heading')} description={t('header.description')} size='lg' />

                <Tabs defaultValue="profile" className="mt-3 w-full">

                    <TabsList className="grid max-w-2xl grid-cols-5">

                        <TabsTrigger value="profile">{t('header.profile')}</TabsTrigger>

                        <TabsTrigger value="account">{t('header.account')}</TabsTrigger>

                        <TabsTrigger value="appearance">{t('header.appearance')}</TabsTrigger>

                        <TabsTrigger value="notifications">{t('header.notifications')}</TabsTrigger>

                        <TabsTrigger value="sessions">{t('header.sessions')}</TabsTrigger>

                    </TabsList>

                    <TabsContent value="profile">

                        <div className="mt-5  space-y-6">

                            <Heading title={t('profile.header.heading')} description={t('profile.header.description')} />

                            <ChangeAvatarForm />

                            <ChangeInfoForm />

                            <SocialLinkForm />

                        </div>

                    </TabsContent>

                    <TabsContent value="account">

                        <div className="mt-5  space-y-6">

                            <Heading title={t('account.header.heading')} description={t('account.header.description')} />

                            <ChangeEmailForm />

                            <ChangePasswordForm />

                            <Heading
                                title={t('account.header.securityHeading')}
                                description={t(
                                    'account.header.securityDescription'
                                )}
                            />

                            <WrapperTotp />

                            <Heading
                                title={t('account.header.deactivationHeading')}
                                description={t(
                                    'account.header.deactivationDescription'
                                )}
                            />

                            <DeactivateCard />

                        </div>

                    </TabsContent>

                    <TabsContent value="appearance">

                        <div className="mt-5  space-y-6">

                            <Heading title={t('appearance.header.heading')} description={t('appearance.header.description')} />

                            <ChangeThemeForm />

                            <ChangeLanguageForm />

                            <ChangeColorForm />

                        </div>

                    </TabsContent>

                    <TabsContent value="notifications">

                        <div className="mt-5  space-y-6">

                            <Heading title={t('notifications.header.heading')} description={t('notifications.header.description')} />

                            <ChangeNotificationForm />

                        </div>

                    </TabsContent>

                    <TabsContent value="sessions">

                        <div className="mt-5  space-y-6">

                            <Heading title={t('sessions.header.heading')} description={t('sessions.header.description')} />

                            <SessionList />

                        </div>

                    </TabsContent>


                </Tabs>

            </div>

        </>

    )

}

export default UserSettings