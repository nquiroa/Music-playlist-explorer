document.addEventListener("DOMContentLoaded", function() {
    const playlistContainer = document.getElementById('playlist-cards');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const playlistDetails = document.getElementById('playlist-details');
    const closeModalButtons = document.querySelectorAll('.close');
    const addPlaylistButton = document.getElementById('add-playlist-button');
    const modalAddPlaylist = document.getElementById('modal-add-playlist');
    const modalAddSong = document.getElementById('modal-add-song');
    const addPlaylistForm = document.getElementById('add-playlist-form');
    const addSongForm = document.getElementById('add-song-form');
    const searchBar = document.getElementById('search-bar');

    let selectedSongs = [];
    let userPlaylists = JSON.parse(localStorage.getItem('userPlaylists')) || [];
    let selectedPlaylistID = null;

    // Load likes from local storage
    function loadLikes() {
        const savedLikes = localStorage.getItem('playlistLikes');
        return savedLikes ? JSON.parse(savedLikes) : {};
    }

    function saveLikes(likes) {
        localStorage.setItem('playlistLikes', JSON.stringify(likes));
    }

    let likesData = loadLikes();

    function createPlaylistCards(playlists = data.playlists) {
        playlistContainer.innerHTML = '';
        playlists.forEach(playlist => {
            if (likesData[playlist.playlistID] !== undefined) {
                playlist.likeCount = likesData[playlist.playlistID];
            }

            const playlistCard = document.createElement('section');
            playlistCard.className = 'playlist-card';
            playlistCard.setAttribute('data-id', playlist.playlistID);

            const img = document.createElement('img');
            img.src = playlist.playlist_art;
            img.className = 'card-image';
            playlistCard.appendChild(img);

            const playlistName = document.createElement('h1');
            playlistName.className = 'card-element';
            playlistName.textContent = playlist.playlist_name;
            playlistCard.appendChild(playlistName);

            const creator = document.createElement('p');
            creator.className = 'card-element';
            creator.textContent = `Created by: ${playlist.playlist_creator}`;
            playlistCard.appendChild(creator);

            const likeContainer = document.createElement('div');
            likeContainer.className = 'card-element like-container';

            const likeIcon = document.createElement('i');
            likeIcon.className = 'fas fa-heart like-icon';
            if (playlist.likeCount > 0) {
                likeIcon.classList.add('liked');
            }
            likeContainer.appendChild(likeIcon);

            const likeCount = document.createElement('p');
            likeCount.className = 'like-count';
            likeCount.textContent = `${playlist.likeCount} likes`;
            likeContainer.appendChild(likeCount);

            likeIcon.addEventListener('click', function(event) {
                event.stopPropagation();
                toggleLike(playlist, likeCount, likeIcon);
            });

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function(event) {
                event.stopPropagation();
                deletePlaylist(playlist.playlistID);
            });
            playlistCard.appendChild(deleteButton);

            playlistCard.appendChild(likeContainer);

            playlistCard.addEventListener('click', function() {
                selectedPlaylistID = playlist.playlistID;
                openModal(playlist);
                modalOverlay.style.display = "block";
            });

            playlistContainer.appendChild(playlistCard);
        });
    }

    function toggleLike(playlist, likeCount, likeIcon) {
        if (!likeIcon.classList.contains('liked')) {
            playlist.likeCount++;
            likeIcon.classList.add('liked');
        } else {
            playlist.likeCount--;
            likeIcon.classList.remove('liked');
        }
        likeCount.textContent = `${playlist.likeCount} likes`;
        likesData[playlist.playlistID] = playlist.likeCount;
        saveLikes(likesData);
        updateCardLikeStatus(playlist.playlistID);
    }

    function updateCardLikeStatus(playlistID) {
        const playlistCard = document.querySelector(`.playlist-card[data-id="${playlistID}"]`);
        if (playlistCard) {
            const likeIcon = playlistCard.querySelector('.like-icon');
            const likeCount = playlistCard.querySelector('.like-count');
            const playlist = data.playlists.find(p => p.playlistID === playlistID);

            if (playlist.likeCount > 0) {
                likeIcon.classList.add('liked');
            } else {
                likeIcon.classList.remove('liked');
            }
            likeCount.textContent = `${playlist.likeCount} likes`;
        }
    }

    function openModal(playlist) {
        selectedSongs = [];
        playlistDetails.innerHTML = `
            <div id="playlist-container-1">
                <img id="image" src="${playlist.playlist_art}">
                <div id="playlist-info">
                    <div id="greytext">
                        <p>Playlist</p>
                    </div>
                    <h1 id="playlist-title">${playlist.playlist_name}</h1>
                    <div id="creator-like">
                        <p id="creator">${playlist.playlist_creator}</p>
                        <p>&nbsp;▫&nbsp;</p>
                        <div class="like-container">
                            <i class="fas fa-heart like-icon ${playlist.likeCount > 0 ? 'liked' : ''}"></i>
                            <p>&nbsp;</p>
                            <p class="like-count">${playlist.likeCount} likes</p>
                        </div>
                        <p>&nbsp;▫&nbsp;</p>
                        <p>${playlist.songs.length} songs</p>
                    </div>
                    <button id="shuffle-button">Shuffle</button>
                </div>
            </div>
            <hr class="solid">
            <div id="song-lineup">
                ${playlist.songs.map(song => `
                    <section id="song-info">
                        <div id="song-img">
                            <img src="${song.cover_art}">
                        </div>
                        <div id="song-lineup-container">
                            <h3>${song.title}</h3>
                            <p>${song.artist}</p>
                            <p>${song.album}</p>
                        </div>
                        <div id="song-runtime">
                            <p>${song.duration}</p>
                        </div>
                    </section>
                `).join('')}
            </div>
        `;

        const modalLikeIcon = playlistDetails.querySelector('.like-icon');
        const modalLikeCount = playlistDetails.querySelector('.like-count');
        modalLikeIcon.addEventListener('click', function() {
            toggleLike(playlist, modalLikeCount, modalLikeIcon);
            updateCardLikeStatus(playlist.playlistID);
        });

        const shuffleButton = document.getElementById('shuffle-button');
        shuffleButton.addEventListener('click', function() {
            shufflePlaylist(playlist);
            openModal(playlist);
        });
    }

    function shufflePlaylist(playlist) {
        for (let i = playlist.songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [playlist.songs[i], playlist.songs[j]] = [playlist.songs[j], playlist.songs[i]];
        }
    }

    function deletePlaylist(playlistID) {
        data.playlists = data.playlists.filter(playlist => playlist.playlistID !== playlistID);
        createPlaylistCards();
    }

    searchBar.addEventListener('input', function(event) {
        const query = event.target.value.toLowerCase();
        const filteredPlaylists = data.playlists.filter(playlist => 
            playlist.playlist_name.toLowerCase().includes(query) || 
            playlist.playlist_creator.toLowerCase().includes(query)
        );
        createPlaylistCards(filteredPlaylists);
    });

    closeModalButtons.forEach(button => {
        button.onclick = function() {
            modalOverlay.style.display = "none";
            modalAddPlaylist.style.display = "none";
            modalAddSong.style.display = "none";
        }
    });

    window.onclick = function(event) {
        if (event.target == modalOverlay) {
            modalOverlay.style.display = "none";
        }
        if (event.target == modalAddPlaylist) {
            modalAddPlaylist.style.display = "none";
        }
        if (event.target == modalAddSong) {
            modalAddSong.style.display = "none";
        }
    }

    addPlaylistButton.addEventListener('click', function() {
        modalAddPlaylist.style.display = "block";
    });

    addPlaylistForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const playlistName = document.getElementById('playlist-name').value;
        const playlistCreator = document.getElementById('playlist-creator').value;
        const playlistArt = document.getElementById('playlist-art').value;

        const newPlaylist = {
            playlistID: data.playlists.length,
            playlist_name: playlistName,
            playlist_creator: playlistCreator,
            playlist_art: playlistArt,
            likeCount: 0,
            songs: []
        };

        data.playlists.push(newPlaylist);
        modalAddPlaylist.style.display = "none";
        createPlaylistCards();
    });

    document.getElementById('add-to-playlist').addEventListener('click', function() {
        modalAddSong.style.display = "block";
    });

    addSongForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const songTitle = document.getElementById('song-title').value;
        const songArtist = document.getElementById('song-artist').value;
        const songAlbum = document.getElementById('song-album').value;
        const songCover = document.getElementById('song-cover').value;
        const songDuration = document.getElementById('song-duration').value;

        const newSong = {
            songID: data.playlists.reduce((acc, playlist) => acc.concat(playlist.songs), []).length,
            title: songTitle,
            artist: songArtist,
            album: songAlbum,
            cover_art: songCover,
            duration: songDuration
        };

        const selectedPlaylist = data.playlists.find(playlist => playlist.playlistID == selectedPlaylistID);
        selectedPlaylist.songs.push(newSong);
        modalAddSong.style.display = "none";
        openModal(selectedPlaylist);
    });

    createPlaylistCards();
});
