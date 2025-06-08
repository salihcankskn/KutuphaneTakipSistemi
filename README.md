Kütüphane Takip Sistemi (Angular & Firebase)
Bu proje, Angular ve Firebase kullanılarak geliştirilmiş, web tabanlı bir kütüphane yönetim ve kitap takip sistemidir. Kullanıcıların kitapları ödünç alıp iade etmelerini sağlarken, adminler için tam bir kitap yönetimi paneli sunar.

🚀 Temel Özellikler
Tüm Kullanıcılar
Kullanıcı Kimlik Doğrulama: Güvenli e-posta/şifre ile sisteme kayıt olma ve giriş yapma.

Kitap Listeleme: Kütüphanedeki tüm kitapları anlık olarak görme.

Akıllı Arama: Kitap adı veya yazar adına göre anında filtreleme yaparak arama.

Kitap Detayları: Kitabın kapak resmi, özeti ve durumu gibi bilgilere modal pencere üzerinden erişim.

Ödünç Alma ve İade Etme: Müsait olan kitapları ödünç alma ve daha önce ödünç alınan kitapları iade etme.

Admin Yetkileri
Tam Kitap Yönetimi (CRUD): Yeni kitap ekleme, mevcut kitapların bilgilerini (başlık, yazar, özet, resim vb.) düzenleme ve sistemden tamamen silme.

Takip Özelliği: Ödünç alınmış bir kitabın hangi kullanıcı tarafından alındığını görme.

🛠️ Kullanılan Teknolojiler
Ön Yüz (Frontend):

Angular

TypeScript

RxJS

Bootstrap & Bootstrap Icons

SCSS

Arka Uç & Veritabanı (Backend-as-a-Service):

Firebase

Firebase Authentication: Kullanıcı yönetimi ve kimlik doğrulama.

Firestore Database: Kitap ve kullanıcı verileri için NoSQL bulut veritabanı.

⚙️ Projeyi Yerel Ortamda Çalıştırma
Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

Projeyi Klonlayın:

git clone https://github.com/KULLANICI_ADINIZ/PROJE_ADI.git

Proje Klasörüne Gidin:

cd PROJE_ADI

Gerekli Paketleri Yükleyin:

npm install

Firebase Yapılandırmasını Ekleyin:

Firebase konsolundan kendi projenizin yapılandırma bilgilerini alın.

Bu bilgileri src/environments/environment.ts dosyası içindeki firebase nesnesine yapıştırın.

Projeyi Başlatın:

ng serve

Uygulama, http://localhost:4200/ adresinde çalışmaya başlayacaktır.
