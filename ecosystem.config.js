module.exports = {
  apps: [
    {
      name: 'koawheel',
      NODE_ENV: 'development',
      max_memory_restart: '1000M',
      script: './bin/www',
      exec_mode: 'fork',
      instances: 1,
      instance_var: 'INSTANCE_ID',
      watch: false,
      output: '/dev/null', // 关闭普通日志
      // error: '/dev/null',
      ignore_watch: ['node_modules', 'logs', 'dist', 'tests', 'tmp'],
      // min_uptime: '', // 应用运行少于时间被认为是异常启动
      // max_restarts: '', // 最大异常重启次数，即小于min_uptime运行时间重启次数；
      // restart_delay: '', // 异常重启情况下，延时重启时间
      env_dev: {
        NODE_ENV: 'development',
        watch: true,
      },
      env_development: {
        NODE_ENV: 'development',
        watch: true,
      },
      env_sit: {
        NODE_ENV: 'sit',
        // exec_mode: 'cluster',
        // instances: 0,  // 不知道为啥无效
      },
      env_prod: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
