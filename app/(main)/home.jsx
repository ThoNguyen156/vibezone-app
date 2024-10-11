import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContext';
import { Button } from 'react-native';
import { supabase } from '../../lib/supabase';
import {wp, hp} from '../../helper/common'
import {theme} from '../../constants/theme'
import Icon from '../../assets/icons/index'
import { useRouter } from 'expo-router';
import Avatar from '../../components/Avatar';
import { fetchPosts } from '../../services/postService';
import PostCard from '../../components/PostCard';

var limit = 0;

const Home = () => {
  const {user, setAuth} = useAuth();
  const [posts, setPosts] = useState([]);

  const router = useRouter();

  useEffect(()=> {
    getPosts();
  }, [])


  const getPosts = async() => {
    limit = limit + 10;
    let res = await fetchPosts(limit);
    // console.log('posts: ', res);
    // console.log('user: ', res.data[0].user);
    if(res.success){
      setPosts(res.data);
    }

  }
 

  
  
  return (
    <ScreenWrapper>
      <View style={styles.container}>
          {/* header */}
          <View style={styles.header}>
              <Text style={styles.title}>VibeZone</Text>
              <View style={styles.icons}>
                <Pressable onPress={() => router.push('notifications')}>
                  <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.textPriamry}/>
                </Pressable>
                <Pressable onPress={() => router.push('newPost')}>
                  <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.textPriamry}/>
                </Pressable>
                <Pressable onPress={() => router.push('profile')}>
                  <Avatar
                    uri={user?.image}
                    size={hp(4.3)}
                    rounded={theme.radius.sm}
                    style={{borderWidth: 2}}
                  />
                </Pressable>
              </View>
          </View>
          {/* post list */}
          <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listStyle}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => <PostCard
              item={item}
              currentUser = {user}
              router ={router}
              />
            }
          />
      </View>
      {/* <Button title='log out' onPress={onLogOut}/> */}
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: wp(4)
  },
  title: {
    color: theme.colors.textPriamry,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    borderColor: theme.colors.subTextPrimary,
    borderWidth: 3
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4)
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.textPriamry  
  },
  pill: {
    position: 'absolute',
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight
  },
  pillText: {
    color: 'white',
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold
  }
})