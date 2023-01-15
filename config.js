module.exports = {
	// 服务启动端口
	port: 3005,
	// 是否启用代理，不启用设为 false
	proxy: 'http://localhost:7890',

	// 私有模式，不启用设为 false
	private: {
		// 仓库所有者，仅这个列表中的所有者的仓库可被访问
		owners: [
			'mem-static',
		],
	},
};
