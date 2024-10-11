import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import BackButton from './BackButton'
import {wp, hp} from '../helper/common'
import { theme } from '../constants/theme'

const Header = ({title, showBackButton = true, mb = 10}) => {
    const router = useRouter();
  return (
    <View style={[styles.container, {marginBottom: mb}]}>
      {
        showBackButton && (
            <View style={styles.showBackButton}>
                <BackButton router={router}/>
            </View>
        )
      }

      <Text style={styles.title}> {title || ""}</Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 7,
        gap: 10
    }, 
    title: {
        fontSize: hp(2.7),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.dark
    },
    showBackButton: {
        position: 'absolute',
        left: 0
    }
})