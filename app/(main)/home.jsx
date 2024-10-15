import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {wp, hp} from '../../helper/common'
import {theme} from '../../constants/theme'
import Icon from '../../assets/icons/index'
import { useRouter } from 'expo-router';
import Avatar from '../../components/Avatar';
import { fetchPosts } from '../../services/postService';
import PostCard from '../../components/PostCard';
import Loading from '../../components/Loading';
import { getUserData } from '../../services/userService';
var limit = 0;

const Home = () => {
  const {user, setAuth} = useAuth();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true)

  const router = useRouter();

  const handlePostEvent = async (payload) => {
    //console.log('post new: ', payload)
    if(payload.eventType == 'INSERT' && payload?.new?.id){
      let newPost = {...payload.new};
      let res = await getUserData(newPost.userId);
      newPost.user = res.success? res.data: {};
      setPosts(prevPosts => [newPost, ...prevPosts]);
    }
  }

  useEffect(()=> {
    let postChannel = supabase
    .channel('posts')
    .on('postgres_changes', 
      {event: '*', schema: 'public', table: 'posts'},
      (payload) => handlePostEvent(payload)
    )
    .subscribe();
    //getPosts();

    return () => {
      supabase.removeChannel(postChannel);
    }
  }, [])


  const getPosts = async() => {

    if(!hasMore) return null;
    limit = limit + 4;
    let res = await fetchPosts(limit);
    if(res.success){
      if(posts.length == res.data.length) setHasMore(false)
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
                  <Icon name="message" size={hp(3.5)} strokeWidth={2} color={theme.colors.textPriamry}/>
                </Pressable>
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
            onEndReached={()=>{
              getPosts();
            }}
            onEndReachedThreshold={0}
            ListFooterComponent={hasMore ? (
              <View style={{marginVertical: posts.length==0? 200: 30}}>
                <Loading/>
              </View>
            ):(
              <View style={{marginVertical: 30}}>
                <Text style={styles.noPosts}>No more posts</Text>
              </View>
            )}
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
    color: theme.colors.textLight  
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