import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TextInput, TouchableOpacity, AsyncStorage, ScrollView} from 'react-native';
import SplashScreen from "../splashscreen";
import Toast, {DURATION} from 'react-native-easy-toast'
import axios from 'axios';
import md5 from 'md5';

class AboutScreen extends Component {
    constructor(props) {
        super(props);

        this._retrieveData();

        this.state = {
            userData: {},
            username: "",
            usernameValidationMsg: ""
        };
    }

    _retrieveData = async () => {
        console.log("in retrieve data");
        try {
          const userData = await AsyncStorage.getItem('userData');
          if (userData !== null) {
            // We have data!!
            userData = JSON.parse(userData);
            console.log(userData);
            this.setState({
                userData,
                username: userData.username
            });
          } else {
              console.log("No data found");
          }
         } catch (error) {
           // Error retrieving data
           console.log(error);
         }
    }

    render() {
        return(
            
<View style={privacyStyles.container}>
<ScrollView>
<Text style={{alignSelf: "center", fontFamily: "Roboto-Medium", fontSize: 22, marginTop: 20, color: "#222"}}>WatchYourTalk Privacy Policy</Text>
<Text style={privacyStyles.headingText}>Privacy and Security Policy</Text>
<Text style={privacyStyles.descriptionText}>At WatchYourTalk, respect for your privacy is foundational to everything we do. Since we started Watchyourtalk we have strived to build our service with a strong set of privacy principles in mind. </Text>
<Text style={privacyStyles.headingText}>1. General Information</Text>
<Text style={privacyStyles.descriptionText}>We, Watchyourtalk, Brisbane, Australia, 4006, collect and process your personal data related to the watchyourtalk app (hereinafter also “App”) and are the “data collector” in terms of the General Data Protection Regulation (GDPR).</Text>
<Text style={privacyStyles.descriptionText}>The protection and confidentiality of your data are very important to us. We therefore only process your data to the extent that</Text>
<Text style={privacyStyles.descriptionText}>It is necessary to provide watchyourtalk services you are requesting</Text>
<Text style={privacyStyles.descriptionText}>You have given your consent to the processing, or</Text>
<Text style={privacyStyles.descriptionText}>We are otherwise authorized to do so under the data protection laws. </Text>
<Text style={privacyStyles.descriptionText}>We always separately obtain a consent from you for the processing of your health data. You can give your consent to the processing of this data, by clicking on the respective button. Your consent will be logged by us.</Text>
<Text style={privacyStyles.descriptionText}>If you have any questions, suggestions or comments, you are welcome to contact our office via email: admin@watchyourtalk.com or mail: 305a/82 Alfred Street, Fortitude Valley, Brisbane, 4006, Queensland, Australia. </Text>

<Text style={privacyStyles.headingText}>2. What information we collect</Text>
<Text style={privacyStyles.descriptionText}>Personal data is specifically protected by law. Watchyourtalk must receive or collect some information to operate, provide, improve, understand, customize, support, and market our Services, including when you install, access, or use our Services. The types of information we receive and collect depend on how you use our Services: </Text>

<Text style={privacyStyles.descriptionText}>We may collect and process the following data about you:</Text>

<Text style={privacyStyles.descriptionText}>Information that you provide by filling in forms on our site www.watchyourtalk.com and our mobile application Watchyourtalk (“our app”). This includes information provided at the time of registering to use our site and our app, downloading and sharing data via our app, making in-app purchases, subscribing to our service, posting material on forums and on your profile, posts, and comments, or requesting further services. We may also ask you for information when you report a problem with our site.</Text>

<Text style={privacyStyles.descriptionText}>The information which you provide us may include your name, date of birth, address, e-mail address, phone number, and username; password; profile photo and any additional photos which you upload to our app; and Facebook, Apple and/or Play Store account information.</Text>

<Text style={privacyStyles.descriptionText}>Your Messages/recording. We do not retain your messages/recordings in the ordinary course of providing our Services to you. Once your messages (including your chats, speech) are delivered, they are deleted from our servers. Your messages are stored on your own device. If a message cannot be delivered immediately (for example, if you are offline), we may keep it on our servers for up to 30 days as we try to deliver it. If a message is still undelivered after 30 days, we delete it. When you uninstall and reinstall Watchyourtalk, the content of your messages are not recoverable in any way, however, the names and group names of those who you were messaging before the uninstall will reappear upon sign in to your account. </Text>

<Text style={privacyStyles.descriptionText}>Customer Support. You may provide us with information related to your use of our services, including copies of messages, posts or comments, and how to contact you so that we can provide you with customer support. For example, you may send us an email with information relating to our app performance or other issues. ·If you contact us, we may keep a record of that correspondence.</Text>

<Text style={privacyStyles.descriptionText}>Health-related data: Within the app, you get an assessment of whether you are suffering from depression. During this screening, you will answer various questions and let the app know how you are feeling. In addition, you can use further services, e.g. payment offers, which are described in more detail in Section 2 of our GTC. We collect, process and use the following health data in order to be able to provide the services for you in accordance with Section 2 of our GTC:</Text>
<Text style={privacyStyles.descriptionText}>Data from the Watchyourtalk screening</Text>
<Text style={privacyStyles.descriptionText}>Questions related to depressive symptoms</Text>
<Text style={privacyStyles.descriptionText}>Questions about other psychological and somatic complaints and symptoms</Text>
<Text style={privacyStyles.descriptionText}>Evaluations of the above-mentioned data regarding the severity and type of symptoms.</Text>
<Text style={privacyStyles.descriptionText}>Mood-related data</Text>
<Text style={privacyStyles.descriptionText}>Your speech data</Text>
<Text style={privacyStyles.descriptionText}>Your information on a scale of smileys with which you can regularly document your mood.</Text>
<Text style={privacyStyles.descriptionText}>Text-based note entries created by you, which are transmitted in encrypted form and stored with us.</Text>
<Text style={privacyStyles.descriptionText}>Technical Data: This is data that tells us what hardware and software you are using to access our app:</Text>
<Text style={privacyStyles.descriptionText}>Data about the mobile platform (iOS/Android)</Text>
<Text style={privacyStyles.descriptionText}>A version of the app</Text>
<Text style={privacyStyles.descriptionText}>Device model</Text>
<Text style={privacyStyles.descriptionText}>System version</Text>
<Text style={privacyStyles.descriptionText}>“Identifier for Advertising in Apple” for iOS devices</Text>
<Text style={privacyStyles.descriptionText}>“Advertising ID” for Android devices</Text>
<Text style={privacyStyles.descriptionText}>App usage data: This is data that tells us how you use our app:</Text>
<Text style={privacyStyles.descriptionText}>How often was the app opened?</Text>
<Text style={privacyStyles.descriptionText}>Which areas were clicked in the app?</Text>
<Text style={privacyStyles.descriptionText}>App settings used (language settings, notifications)</Text>
<Text style={privacyStyles.descriptionText}>Feedback data (incl. e-mail service).</Text>

<Text style={privacyStyles.headingText}>Automatically Collected Information</Text>
<Text style={privacyStyles.descriptionText}>Usage and Log Information. We collect information about your activity on our services, like service-related, diagnostic and performance information. This includes information about your activity (including how you use the service, your service settings, how you interact with others using our services, and the time, frequency, and duration of your activities and interactions), log files, and diagnostic, crash, website and performance logs, and reports. This also includes information about when you registered to use our services, the features you are using on Watchyourtalk. .</Text>
<Text style={privacyStyles.descriptionText}>Device and Connection Information. We collect device and connection specific information when you install, access or use our services. This includes information like the type of mobile device you use, a unique device identifier (for example, your device’s IMEI number, the MAC address of the device’s wireless network interface, or the mobile phone number used by the device, sometimes referred to as a device ID or token), mobile network information, your mobile operating system and the type and version of mobile software which you use, Information stored on your device, including contact information, friends lists, login information, photos, videos or other digital content; General, aggregated, demographic, and non-personal data (such as aggregated anonymous information about website usage and other forms of analytical data). It will not be linked to any of your personal data, through cookies or other means, without your consent; Information which you provide to us by completing surveys or polls, and which we use for research purposes.  You do not have to respond to these surveys. Details of transactions you carry out through our site and of the fulfillment of any in-app purchases; and details of your visits to our site including, but not limited to, traffic data, location data, weblogs and other communication data, whether this is required for our own billing purposes or otherwise, and the resources that you access.</Text>
<Text style={privacyStyles.descriptionText}>Location Information. We may use GPS technology to determine your current location. Some of our location-enabled services require your personal data for the feature to work. If you wish to use the particular feature, you will be asked to consent to your data being used for this purpose. You can withdraw your consent at any time by emailing us on admin@watchyourtalk.com;</Text>
<Text style={privacyStyles.descriptionText}>IP addresses and cookies. We use cookies to operate and provide our services, including to provide our services that are web-based, improve your experiences, understand how our services are being used and customize our services. We may collect information about your computer, including where available your IP address, operating system, and browser type, and your mobile phone, including details of your mobile handset and mobile software, for system administration and to collate aggregate information. This is statistical data about our users’ browsing actions and patterns and the use of our app, and does not identify any individual.</Text>
<Text style={privacyStyles.descriptionText}>For the same reason, we may obtain information about your general internet usage by using a cookie file which is stored on the hard drive of your computer. </Text>
<Text style={privacyStyles.descriptionText}>Where we store your personal data. We may use third-party vendors, such as Amazon, to store your data. Your data may be transferred to and stored in locations in Australia. By submitting your personal data, you agree to this transfer, storing or processing to jurisdictions in Australia. We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this privacy policy.</Text>
<Text style={privacyStyles.descriptionText}>All information you provide to us is stored on our secure servers. Any payment transactions will be encrypted using SSL or other appropriate technology.  Where we have given you (or where you have chosen) a password which enables you to access certain parts of our site, you are responsible for keeping this password confidential.  We ask you not to share a password with anyone. Unfortunately, the transmission of information via the internet is not completely secure. Although we will do our best to protect your personal data, we cannot guarantee the security of your data transmitted to our site; any transmission is at your own risk.  Once we have received your information, we will use strict procedures and security features to try to prevent unauthorized access.</Text>

<Text style={privacyStyles.headingText}>How we process your data</Text>
<Text style={privacyStyles.descriptionText}>We collect and store your health, technical and app usage data while you use our app. Furthermore, we transmit your health data in a completely anonymous form to universities Watchyourtalk cooperates with, in research. </Text>
<Text style={privacyStyles.descriptionText}>We use the information we have (subject to choices you make) to operate, provide, improve, understand, customize, support and market our Services. Here’s how:</Text>

<Text style={privacyStyles.headingText}>Uses made of the information</Text>
<Text style={privacyStyles.descriptionText}>Our Services. We use the information we have to operate and provide our Services, including providing customer support, and improving, fixing and customizing our services. We understand how people use our Services and analyze and use the information we have to evaluate and improve our Services, research, develop and test new services and features, and conduct troubleshooting activities. We also use your information to respond when you contact us.</Text>
<Text style={privacyStyles.descriptionText}>Safety And Security. We verify accounts and activity, and promote safety and security on and off our Services, such as by investigating suspicious activity or violations of our Terms or Community Guidelines, and to ensure our Services are being used legally.</Text>
<Text style={privacyStyles.descriptionText}>Please also note that information we hold and information that you share may be passed to the appropriate authorities or regulators where: this is required or requested by the authorities or by law; we have concerns that any individual is likely to cause harm to themselves or other people, or there is an actual or suspected case of cyberbullying and we are requested by appropriate authorities to provide such information or cooperate with their investigation.</Text>
<Text style={privacyStyles.descriptionText}>Research. We may also disclose data obtained from our sites and our app to academic institutions and research bodies for research purposes specifically related to mental health and peer support. We ensure that any such data is de-identified before it is transferred and that any recipients of this data adhere to adequate standards of data security, ethical review, and privacy. You can withdraw your consent at any time by emailing us on admin@watchyourtalk.com.</Text>
<Text style={privacyStyles.descriptionText}>E-mail Marketing and Newsletters. We may use your personal data from time to time to contact you (via electronic means) with our internal newsletters and details of new blog posts and other communications or services that we are available on our site or our app, where we think these may be of interest to you. Our emails will contain links which enable you to “unsubscribe” to such communications at any point. We do not disclose information about identifiable individuals to our advertisers, but we may provide them with aggregated information about our users. We may also use such aggregated information to help advertisers reach the kind of audience they want to target. We may make use of the personal data we have collected from you to enable us to comply with our advertisers’ wishes by displaying their advertisement to that target audience. Our site and our app may, from time to time, contain links to and from the websites of our partner networks, advertisers and affiliates.  If you follow a link to any of these websites, please note that these websites have their own privacy policies and that we do not accept any responsibility or liability for these policies. Please check these policies before you submit any personal data to these websites.</Text>

<Text style={privacyStyles.headingText}>For what purposes we process your data</Text>
<Text style={privacyStyles.descriptionText}>Watchyourtalk collects, processes and uses the data mentioned under point 2 to provide the services mentioned in point 2 of our General Terms and Conditions (Art. 1 GDPR). By providing us with your information, we can provide our services.</Text>
<Text style={privacyStyles.descriptionText}>if you do not provide us with the necessary data, we cannot provide the services specified in Section 2 of the GTC for you.</Text>
<Text style={privacyStyles.descriptionText}>Watchyourtalk transmits your health data in a completely anonymous form to the universities mentioned above (point 3) for research purposes.</Text>
<Text style={privacyStyles.descriptionText}>Your data according to point 2 of this data protection declaration will be stored by us as long as this is necessary for the use of our app and the services associated with it. The anonymized data can also be stored indefinitely for research purposes.</Text>

<Text style={privacyStyles.descriptionText}>You share your information as you use and communicate through our Services, and we share your information to help us operate, provide, improve, understand, customize, support and market our services.</Text>

<Text style={privacyStyles.headingText}>With whom we share your information</Text>

<Text style={privacyStyles.descriptionText}>We may partner with third-party advertisers, ad networks, and analytics providers to deliver advertising and content targeted to your interests and to better understand your use of the Services. These third parties may collect information sent by your computer, browser, or mobile device in response to a request for content, such as unique identifiers, your IP address, or other information about your computer or device. For example:</Text>
<Text style={privacyStyles.descriptionText}>Advertisers and Ad Networks. Our ad partners and ad networks may use cookies and use related technologies to collect information when ads are delivered to you on our Services, but Watchyourtalk does not link to or provide them with your actual Watchyourtalk account details. This means that Watchyourtalk does not share your individual account habits with advertisers. TalkLife cannot see advertisers’ cookies and advertisers will not see Watchyourtalk cookies.</Text>
<Text style={privacyStyles.descriptionText}>Analytics Partners. We use analytics partners (such as Google Analytics) to help analyze usage and traffic for our Services. As an example, we may use analytics partners to analyze and measure, in the aggregate, the number of unique visitors to our Services.</Text>

<Text style={privacyStyles.headingText}>Where we store your data and how we protect your data</Text>
<Text style={privacyStyles.descriptionText}>We store your data on servers of our IT service providers in Sydney, who process your data on our behalf and on the legal basis of Art. 28 GDPR and are obliged to comply with the legal provisions on data protection and data security. In addition, in case you lose your phone or want to use Watchyourtalk on several devices in parallel, we will store an encrypted ID on Apple’s servers with which only our app can communicate.</Text>
<Text style={privacyStyles.descriptionText}>We take precautions to protect your data and to prevent misuse.</Text>
<Text style={privacyStyles.descriptionText}>The app communicates with our server via encrypted connections using SSL (Secure Socket Layer), which prevents third parties from accessing your data without authorization. Both servers and databases are behind firewalls to restrict access. Our provider AWS complies with ISO 27018, a code of conduct that focuses on the protection of personal data in the cloud. Please note that in some employment relationships it is not allowed to use the Internet for private purposes during working hours or from your workplace. Some employers monitor unauthorized Internet activity in the workplace. Even if you are otherwise connected in multiple network environments, you must be aware that there is always a risk of unwanted access.</Text>

<Text style={privacyStyles.headingText}>Third Part Tools </Text>
<Text style={privacyStyles.descriptionText}>Watchyourtalk partly commissions third-party providers to provide services for the analysis and evaluation of user behavior. We do this to continuously improve and develop Watchyourtalk. The information transmitted for this purpose is pseudonymized. In detail we use the following tools:</Text>
<Text style={privacyStyles.descriptionText}>a. Facebook SDK</Text>
<Text style={privacyStyles.descriptionText}>We have integrated the Facebook Software Development Kit (SDK). The Facebook SDK is operated by Facebook Inc, Palo Alto, USA (Facebook). It helps to increase the success of Facebook advertising campaigns, for example by not displaying advertising on devices on which it is already installed. The Facebook SDK also allows various evaluations of the app installation and the success of advertising campaigns. In addition, individual activities (events) of the user can be analyzed within the app in order to define the target group for advertising campaigns more precisely and better, for example. For this purpose, we send Facebook pseudonymous data, such as the app ID, and the information that the app has been launched. The advertising ID provided by the operating system of the mobile device serves as the pseudonym.</Text>
<Text style={privacyStyles.descriptionText}>c. Google Firebase</Text>
<Text style={privacyStyles.descriptionText}>We use the Google Firebase service to deliver push messages. For this purpose, a device token from Apple or a registration ID from Google is assigned. The sole purpose of their use by us is the provision of push services. These are encrypted anonymized device IDs.</Text>
<Text style={privacyStyles.descriptionText}>d. Crashlytics</Text>
<Text style={privacyStyles.descriptionText}>We work with Crashlytics Inc. “(“Crashlytics”), a service that stores events when users use Watchyourtalk. Crashlytics collects app usage data specifically related to system crashes and bugs. It uses information about the device, the version of the app that is installed, and other information that can help fix bugs, especially regarding the user’s software and hardware. Crashlytics is operated by Google LLC, based in the USA.</Text>
<Text style={privacyStyles.descriptionText}>e. Tenjin</Text>
<Text style={privacyStyles.descriptionText}>Watchyourtalk uses the user behavior analysis technology of Tenjin Inc. (“Tenjin”). Tenjin collects installation and event data, such as “App open”. We use this anonymous information to understand how our users interact with the app and to analyze campaigns. For such an analysis Tenjin uses your pseudonymized IDFA or Android ID.</Text>
<Text style={privacyStyles.descriptionText}>f. Branch Metrics</Text>
<Text style={privacyStyles.descriptionText}>Our app uses Branch Metrics whose operator is Branch Metrics Inc, 2443 Ash Street, Palo Alto, CA 94306, USA. This service is an open-source solution, which makes it possible with appropriate software development kits (SDKs) for Web, iOS and Android operating systems to generate targeted Smart links to contents within an App. Branch Metrics collects information about the provision of the service and its functions. These are encrypted pseudonymized device IDs.</Text>

<Text style={privacyStyles.headingText}>Managing And Deleting Your Information</Text>

<Text style={privacyStyles.descriptionText}>We store information until it is no longer necessary to provide our services, or until your account is deleted, whichever comes first. This is a case-by-case determination that depends on things like the nature of the information, why it is collected and processed, and relevant legal or operational retention needs.</Text>
<Text style={privacyStyles.descriptionText}>If you would like to manage, change, limit, or delete your information, we allow you to do that through the following tools:</Text>

<Text style={privacyStyles.descriptionText}>Deleting Your Account. You may delete your Watchyourtalk account at any time (including if you want to revoke your consent to our use of your information) using our in-app delete account feature. When you delete your Watchyourtalk account, your undelivered messages are deleted from our servers as well as any of your other information we no longer need to operate and provide our Services. We endeavor to remove your information from all of our servers within 14 days of deletion. If you sign into your Watchyourtalk account at any stage during that period, your account will reactivate and you will need to use our in-app deletion tool again to remove your information.</Text>
<Text style={privacyStyles.descriptionText}>Our Policies Concerning Minors</Text>
<Text style={privacyStyles.descriptionText}>Age Requirements. Although we welcome users from all walks of life, Watchyourtalk is not intended or directed at individuals under the age of 16 years of age. Therefore, individuals under the age of 16 may not create an account. We do not knowingly collect information from children under the age of 16 and if you are under this age you must not use our Services. If we become aware that you are under 16 and using our app or our site, we may terminate your user account and issue bans to your device.</Text>
<Text style={privacyStyles.descriptionText}>Law And Protection</Text>
<Text style={privacyStyles.descriptionText}>We collect, use, preserve, and share your information if we have a good-faith belief that it is reasonably necessary to (a) respond pursuant to applicable law or regulations, to legal process, or to government requests; (b) enforce our Terms and any other applicable terms and policies, including for investigations of potential violations; (c) detect, investigate, prevent, and address fraud and other illegal activity, security, or technical issues; or (d) protect the rights, property, and safety of our users, Watchyourtalk, or others, including to prevent death or imminent bodily harm.</Text>
<Text style={privacyStyles.descriptionText}>Our Global Operations</Text>
<Text style={privacyStyles.descriptionText}>Watchyourtalk shares information globally, both internally, and externally with our partners and with those you communicate around the world in accordance with this Privacy Policy. Information controlled by Watchyourtalk will be transferred or transmitted to or stored and processed, in Australia or other countries outside of where you live for the purposes as described in this Privacy Policy. These data transfers are necessary to provide the Services set forth in our Terms and globally to operate and provide our Services to you.</Text>
<Text style={privacyStyles.descriptionText}>Changes to our privacy policy</Text>
<Text style={privacyStyles.descriptionText}>We will occasionally update this Privacy Policy to reflect changes in our practices and services. When we post changes to this Privacy Policy, we will revise the “Last Updated” date at the top of this Privacy Policy and the revised Privacy Policy will come into effect on the date it was posted to our site or our app or as otherwise notified by us. If we make any material changes in the way we collect, use, and/or share your personal information, we will notify you by prominently posting notice of the changes on our sites and/or our app and, where appropriate, notifying you by email. We recommend that you check this page from time to time to inform yourself of any changes in this Privacy Policy. By continuing to use our site or our app after we have posted a revised Privacy Policy you acknowledge that you have consented to the revised Privacy Policy.</Text>

<Text style={privacyStyles.headingText}>Contact</Text>
<Text style={privacyStyles.descriptionText}>Questions, comments, and requests regarding this privacy policy are welcomed and should be addressed to The Data Protection Officer for Watchyourtalk-admin@watchyourtalk.com</Text>
</ScrollView>
</View>

        )
    }
}

const privacyStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    headingText : {
        color: "#222",
        fontSize: 18,
        marginTop: 20,
        fontFamily: "Roboto-Medium",
        paddingHorizontal: 20
    },
    descriptionText : {
        color: "#444",
        fontSize: 15,
        marginTop: 10,
        fontFamily: "OpenSans-SemiBold",

        paddingHorizontal: 20
    },
    formContainer : {
        flex: 1,
        justifyContent: "center",
        padding: 20
    },
    loginHeading : {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 25,
        alignSelf: "center",
        color: "#222"
    },
    input : {
        height: 40,
        borderColor: "#e1e1e1", 
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        color: "#333",
        backgroundColor: "#fff",
        fontFamily: "Roboto-Regular",
    },
    loginButton : {
        height: 40,
        backgroundColor: "#FF7417",
        alignSelf: "stretch",
        justifyContent: "center",
        borderRadius: 5
    },
    loginButtonText : {
        alignSelf: "center",
        color: "#fff",
        fontFamily: "OpenSans-SemiBold"
    },
    helpContainer : {
        flexDirection: "row",
        marginTop: 30
    },
    forgotPasswordContainer : {
        flex: 1
    },
    registerContainer : {
        flex: 1
    }
});

export default AboutScreen;