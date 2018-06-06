# -*- mode: ruby -*-
# vi: set ft=ruby :

require 'json'

Vagrant.configure("2") do |config|
    config.ssh.username = "vagrant"
    config.ssh.password = "vagrant"
    config.vm.box = "scotch/box"
    config.vm.network "private_network", ip: "192.168.33.10"
    config.vm.hostname = "scotchbox"
    config.vm.synced_folder ".", "/var/www/public", :mount_options => ["dmode=777", "fmode=666"]
    config.vm.provision "shell", inline: <<-SHELL
      mailcatcher --http-ip=0.0.0.0
    SHELL
end
