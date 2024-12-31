import React from 'react'
import { BlogHero } from '../../components/blog/HeroB/BlogHero'
import LatestPosts from '../../components/blog/Card/Posts'
import AboutMe from '../../components/blog/Card/AboutMe'
import SocialCTA from '../../components/blog/Card/SocialCTA'

export const BlogPage = () => {
  return (
    <>
      <BlogHero/>
      <LatestPosts/>
      <AboutMe/>
      <SocialCTA/>
    </>
  )
}
