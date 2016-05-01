# -*- mode: ruby -*-
# vi: set ft=ruby :

require 'json'

Vagrant.configure("2") do |config|
    config.vm.box = "scotch/box"
    config.vm.network "private_network", ip: "192.168.33.10"
    config.vm.hostname = "scotchbox"
    config.vm.synced_folder ".", "/var/www/public", :mount_options => ["dmode=777", "fmode=666"]

    if File.exists?(File.expand_path "./ftp.json")
        ftp_array = JSON.parse(File.read(File.expand_path "./ftp.json"))

        config.push.define "ftp" do |push|
            push.host = ftp_array["host"]
            push.username = ftp_array["username"]
            push.password = ftp_array["password"]
            push.destination = ftp_array["destination"]
            ftp_array["exclude"].each { |element|
                push.exclude = element
            }
        end
    end
end
