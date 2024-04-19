<?php 

if (!function_exists('blogus_main_content')) :
    function blogus_main_content()
    { 
        if(!is_front_page() || !is_home()) {
            do_action('blogus_breadcrumb_content');
        }
        $blogus_content_layout = esc_attr(get_theme_mod('blogus_content_layout','align-content-right'));
        if($blogus_content_layout == "align-content-left" || $blogus_content_layout == "grid-left-sidebar") { ?>
            <!--col-lg-4-->
            <aside class="col-lg-4 sidebar-left">
                <?php get_sidebar();?>
            </aside>
            <!--/col-lg-4-->
        <?php } ?>
            <!--col-lg-8-->
        <?php if($blogus_content_layout == "align-content-right" || $blogus_content_layout == "align-content-left"){ ?>
            <div class="col-lg-8 content-right">
                <?php get_template_part('template-parts/content', get_post_format()); ?>
            </div>
        <?php } elseif($blogus_content_layout == "full-width-content") { ?>
            <div class="col-lg-12 content-full">
                <?php get_template_part('template-parts/content', get_post_format()); ?>
            </div>
        <?php }  if($blogus_content_layout == "grid-left-sidebar" || $blogus_content_layout == "grid-right-sidebar"){ ?>
            <div class="col-lg-8 content-right">
                <?php get_template_part('content','grid'); ?>
            </div>
        <?php } elseif($blogus_content_layout == "grid-fullwidth") { ?>
            <div class="col-lg-12 content-full">
                <?php get_template_part('content','grid'); ?>
            </div>
        <?php } ?>
            <!--/col-lg-8-->
        <?php if($blogus_content_layout == "align-content-right" || $blogus_content_layout == "grid-right-sidebar") { ?>
            <!--col-lg-4-->
            <aside class="col-lg-4 sidebar-right">
                <?php get_sidebar();?>
            </aside>
            <!--/col-lg-4-->
        <?php }        
    }
endif;
add_action('blogus_action_main_content_layouts', 'blogus_main_content', 40);