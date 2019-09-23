<template>
    <div class="banner">
        <slot></slot>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="stylus">
.banner {
    overflow hidden
    border-radius 3px
    padding 8px 10px 2px 10px
    img{
        width 100%
    }
}
</style>
