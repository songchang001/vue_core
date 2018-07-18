const path=require('path');
const HTMLPlugin=require('html-webpack-plugin')
const webpack = require('webpack')
const Extractplugin=require('extract-text-webpack-plugin');

//是否是测试环境
const isDev = process.env.NODE_ENV === 'development';

const config={
    target:'web',
    entry:path.join(__dirname,'src/index.js'),
    output:{
        filename:'bundle.[hash:8].js',
        path:path.join(__dirname,'dish')
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader'
            }, 
            {
                test:/\.jsx$/,
                loader:'babel-loader'
            },
            {
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test:/\.less$/,
                use:[
                    'style-loader',
                    'css-loader',
                    {
                        loader:'postcss-loader',
                        options:{sourceMap:true}
                    },
                    'less-loader'
                ]
            },
            {
                
            },
            {
                test:/\.(gif|jpg|jpeg|png|svg)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:1024,
                            name:'[name]-aaa.[ext]'
                        }                    
                    }
                ]
                
            }
        ]
    },
    plugins:[
        //设置环境变量值 生产环境 or 开发环境
        new webpack.DefinePlugin({
            'progess.env':{
                NODE_ENV:isDev?'"developent"':'"production"'
            }
        }),
        //自动生成html文件
        new HTMLPlugin()
    ]
}




/**
 * 判断是否是开发环境
 *      在config中设置不同的参数
 * */ 
//如果是开发环境
if(isDev){
    //设置 styl 预处理器
    config.module.rules.push({
        test:/\.styl$/,
        use:[
            'style-loader',
            'css-loader',
            {
                loader:'postcss-loader',
                options:{sourceMap:true}
            },
            'stylus-loader'
        ]
    })
    //设置 source-map
    config.devtool='source-map'
    //设置 dev-server 的参数
    config.devServer={
        port:8008,
        host:'127.0.0.1',
        overlay:{
            errors:true
        },
        //是否启用热加载
        hot:true,
        //open:true, //自动打开页面
        // historyFallback:{

        // }
    }
    //添加插件
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),//启用 模块热替换插件
        new webpack.NoEmitOnErrorsPlugin()      //在编译出现错误时，确保输出资源不会包含错误
    )
//如果不是开发环境 是生产环境    
}else{

    //设置 styl 预处理器
    config.module.rules.push({
        test:/\.styl$/,
        //使用 Extractplugin 将 css 生成单独文件
        use:Extractplugin.extract({
            fallback:'style-loader',
            use:[
                'css-loader',
                {
                    loader:'postcss-loader',
                    options:{sourceMap:true}
                },
                'stylus-loader'
            ]
        })
    })

    //添加插件    
    config.plugins.push(
        //使用 Extractplugin插件 将 css 生成单独文件，根据内容生成 contentHash 哈希值
        new Extractplugin('styles.[contentHash:8].css'),
        //单独生成 vendor.js ,将固定的框架 分离出来
        new webpack.optimize.CommonsChunkPlugin({
            name:'vendor'
        }),
        //
        new webpack.optimize.CommonsChunkPlugin({
            name:'runtime'
        })
    )

    //设置 出口文件 参数，output文件 使用 chuckhash，每个文件时是单独节点
        //chuckhash和hash区别：hash 所有output文件hash值是一样的，chuckhash所有output文件有不同的hash值
    config.output.filename="[name].[chunkhash:8].js"

    //设置入口文件设置
    config.entry={
        app:path.join(__dirname,'src/index.js'),
        //生成 vendor.js 文件
        vendor:['vue']
    }
}


module.exports=config;