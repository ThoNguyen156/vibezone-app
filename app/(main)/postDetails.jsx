import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import {useLocalSearchParams, useRouter} from 'expo-router'
import { createComment, fetchPostDetails } from '../../services/postService';
import { hp, wp } from '../../helper/common';
import { theme } from '../../constants/theme';
import PostCard from '../../components/PostCard';
import {useAuth} from '../../contexts/AuthContext'
import ScreenWrapper from'../../components/ScreenWrapper'
import Loading from '../../components/Loading';
import Input from '../../components/Input'
import Icon from '../../assets/icons';
import CommentItem from '../../components/CommentItem';



const PostDetails = () => {
    const {postId} = useLocalSearchParams();
    const {user} = useAuth();
    const router = useRouter();
    const [startLoading, setStartLoading] = useState(true);
    const inputRef = useRef(null);
    const commentRef = useRef("");
    const [loading, setLoading] = useState(false);
    //console.log(postId);

    const [post, setPost] = useState(null);

    //console.log('post detail item: ', post)


    // fetch post detail
    useEffect(() => {
        getPostDetails();
    },[])

    // post detail
    const getPostDetails= async()=> {
        let res = await fetchPostDetails(postId);
        if(res.success) setPost(res.data);
        setStartLoading(false);
    }


    // create new comment
    const onNewComment = async () => {
        if(!commentRef.current) return null;
        let data = {
            userId: user?.id,
            postId: post?.id,
            text: commentRef.current 
        }

        // create comment
        setLoading(true);
        let res = await createComment(data);
        setLoading(false);
        if(res.success){
            inputRef?.current?.clear();
            commentRef.current = "";
        }else{
            Alert.alert('Comment', res.msg);
        }
    }

    if(startLoading){
        return (
            <View style={styles.center}>
                <Loading/>
            </View>
        )
    }
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
                    <PostCard
                        item={{...post, comments: [{count: post?.comments?.length}]}}
                        currentUser={user}
                        router={router}
                        hashShadow={false}
                        showMoreIcon={false}
                    />

                    {/* comment input */}
                    <View style={styles.inputContainer}>
                        <Input
                            inputRef={inputRef}
                            placeholder="Comment..."
                            onChangeText = {value => commentRef.current = value}
                            placeholderTextColor={theme.colors.textLight}
                            containerStyles={{flex: 1, height: hp(6.2), borderRadius: theme.radius.xl}}
                        />
                        {
                            loading ? (
                                <View style={styles.loading}>
                                    <Loading size="small"/>
                                </View>
                            ): (
                                <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                                    <Icon name="send" color={theme.colors.primary}/>
                                </TouchableOpacity>
                            )
                        }
                        
                    </View>

                    {/* comment list */}
                    <View style={{marginVertical: 15, gap: 17}}>
                        {
                            post?.comments?.map(comment => 
                                <CommentItem
                                    key={comment?.id?.toString()}
                                    item={comment}
                                />
                            )
                        }
                        
                        {
                            post?.comments?.length == 0 && (
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{color: theme.colors.dark}}>Be first the comment !</Text>
                                </View>
                            )
                        }
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}

export default PostDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: wp(7)
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    list: {
        paddingHorizontal: wp(4)
    },
    sendIcon: {
        alignItems:'center',
        justifyContent: 'center',
        borderWidth: 0.8,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        height: hp(5.8),
        width: hp(5.8)
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    notFound: {
        fontSize: hp(2.5),
        color: theme.colors.dark,
        fontWeight: theme.fonts.medium
    },
    loading: {
        height: hp(5.8),
        width: hp(5.8),
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{scale: 1.3}]
    }
})