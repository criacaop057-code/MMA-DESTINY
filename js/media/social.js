import { createId } from "../core/ids.js";

const PLATFORMS = {
    INSTAGRAM: "instagram",
    X: "x",
    YOUTUBE: "youtube",
    TIKTOK: "tiktok"
};

function createSocialProfile() {
    return {
        followers: {
            instagram: 0,
            x: 0,
            youtube: 0,
            tiktok: 0
        },

        engagement: {
            instagram: 0,
            x: 0,
            youtube: 0,
            tiktok: 0
        },

        posts: [],
        viralMoments: 0,
        totalPosts: 0
    };
}

function createPost(platform, content, context = {}) {
    return {
        id: createId("post"),
        platform,
        content,
        context,
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        engagement: 0,
        viral: false,
        createdAt: new Date().toISOString()
    };
}

function calculateEngagement(post, profile) {
    const followers =
        profile.followers[post.platform] || 0;

    const base =
        Math.max(1, Math.floor(followers * 0.03));

    const likes =
        Math.floor(base * (0.5 + Math.random()));

    const comments =
        Math.floor(likes * (0.03 + Math.random() * 0.05));

    const shares =
        Math.floor(likes * (0.01 + Math.random() * 0.04));

    const views =
        Math.max(
            likes * 10,
            Math.floor(followers * (0.5 + Math.random() * 2))
        );

    post.likes = likes;
    post.comments = comments;
    post.shares = shares;
    post.views = views;

    post.engagement =
        likes +
        comments * 2 +
        shares * 3;

    if (views > followers * 5 && followers > 0) {
        post.viral = true;
    }

    return post;
}

function publishPost(profile, platform, content, context = {}) {
    if (!profile) return null;

    const post = createPost(
        platform,
        content,
        context
    );

    calculateEngagement(post, profile);

    profile.posts.unshift(post);

    profile.totalPosts++;

    if (post.viral) {
        profile.viralMoments++;
    }

    const growth =
        calculateFollowerGrowth(
            post,
            profile.followers[platform]
        );

    profile.followers[platform] += growth;

    return post;
}

function calculateFollowerGrowth(post, followers) {
    let growth = Math.floor(
        followers * 0.002
    );

    if (post.engagement > followers * 0.03) {
        growth += Math.floor(
            followers * 0.003
        );
    }

    if (post.viral) {
        growth += Math.floor(
            Math.max(50, followers * 0.02)
        );
    }

    if (followers === 0) {
        growth += 25;
    }

    return Math.max(0, growth);
}

function getTotalFollowers(profile) {
    if (!profile) return 0;

    return Object.values(profile.followers)
        .reduce((sum, value) => sum + value, 0);
}

function getMainPlatform(profile) {
    if (!profile) return null;

    return Object.entries(profile.followers)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

function processWeeklySocial(profile) {
    if (!profile) return null;

    for (const platform of Object.keys(profile.followers)) {
        const followers = profile.followers[platform];

        if (followers > 0) {
            const passiveGrowth =
                Math.max(
                    1,
                    Math.floor(followers * 0.001)
                );

            profile.followers[platform] += passiveGrowth;
        }
    }

    if (profile.posts.length > 100) {
        profile.posts =
            profile.posts.slice(0, 100);
    }

    return profile;
}

export {
    PLATFORMS,
    createSocialProfile,
    createPost,
    publishPost,
    calculateEngagement,
    calculateFollowerGrowth,
    getTotalFollowers,
    getMainPlatform,
    processWeeklySocial
};
