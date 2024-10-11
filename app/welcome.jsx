import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { wp, hp } from '../helper/common'
import { theme } from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router'


const Welcome = () => {
    const router = useRouter();
  return (
    <ScreenWrapper bg="white">
        <StatusBar style="dark"/>
        <View style={styles.container}>
            {/* welcome imgage */}
            <Image style={styles.welcomImage} resizeMode='contain' source={require('../assets/images/network.jpg')}/>

            {/* title */}
            <View style={{gap: 20}}>
                <Text style={styles.title}>VibeZone!</Text>
                <Text style={styles.punchline}>
                    Where Energy and Serenity Blend. Find inspiration, relaxation, and balance in this positive space.
                </Text>
            </View>

            {/* footer */}
            <View style={styles.footer}>
                <Button 
                    title='Getting Started'
                    buttonStyle={{
                        marginHorizontal: wp(3)
                    }}
                    onPress={() => router.push('signUp')}
                />

                <View style={styles.bottomTextContainer}>
                    <Text style={styles.loginText}>
                        Already have an account !
                    </Text>
                    <Pressable onPress={() => router.push('login')}>
                        <Text style={[styles.loginText, {color: theme.colors.subPrimary, fontWeight: theme.fonts.semibold}]}>
                            Login
                        </Text>
                    </Pressable>
                </View>
            </View>
            
        </View>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingHorizontal: wp(4)
        
    },
    welcomImage: {
        height: hp(40),
        width: wp(100),
        alignSelf: 'center'
    },
    title: {
        color: theme.colors.subPrimary,
        fontWeight: theme.fonts.extraBold,
        fontSize: hp(4),
        textAlign: 'center'
    },
    punchline: {
        textAlign: 'center',
        paddingHorizontal: wp(10),
        fontSize: hp(1.7),
        color: theme.colors.subPrimary
    },
    footer: {
        gap: 30, 
        width: '100%'
    },
    bottomTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    },
    loginText: {
        textAlign: 'center',
        color: theme.colors.subPrimary,
        fontSize: hp(1.6)
    }
})