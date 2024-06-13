document.addEventListener("DOMContentLoaded", function() {
    const featuredImage = document.getElementById('featured-image');
    const featuredName = document.getElementById('featured-name');
    const featuredCreator = document.getElementById('featured-creator');
    const featuredLikes = document.getElementById('featured-likes');
    const featuredSongCount = document.getElementById('featured-song-count');
    const featuredSongs = document.getElementById('featured-songs');

    function getRandomPlaylist() {
        const randomIndex = Math.floor(Math.random() * data.playlists.length);
        return data.playlists[randomIndex];
    }

    function displayPlaylist(playlist) {
        featuredImage.src = playlist.playlist_art;
        featuredName.textContent = playlist.playlist_name;
        featuredCreator.textContent = `Created by: ${playlist.playlist_creator}`;
        featuredLikes.textContent = `${playlist.likeCount} likes`;
        featuredSongCount.textContent = `${playlist.songs.length} songs`;

        featuredSongs.innerHTML = '';

        playlist.songs.forEach(song => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div id="song-info">
                    <div id="song-img">
                        <img src="${song.cover_art}" alt="Song Cover Art">
                    </div>
                    <div id="song-lineup-container">
                        <h3>${song.title}</h3>
                        <p>${song.artist}</p>
                        <p>${song.album}</p>
                    </div>
                    <div id="song-runtime">
                        <p>${song.duration}</p>
                    </div>
                </div>
            `;
            featuredSongs.appendChild(li);
        });
    }

    const randomPlaylist = getRandomPlaylist();
    displayPlaylist(randomPlaylist);
});
