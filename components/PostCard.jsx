import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PostCard = ({
    item,
    currentUser,
    router,
    hashShadow = true
}) => {
    //console.log('post item: ', item)
    const shadowStyles = {
        shadowOffset: {
            with: 0,
            height: 2
        },
        shadowOpacity: 0.06,
        
    }
  return (
    <View>
      <Text>PostCard</Text>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({})